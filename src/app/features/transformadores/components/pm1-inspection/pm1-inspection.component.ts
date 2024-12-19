import { Component,OnInit,ViewEncapsulation, ViewChild, ElementRef,AfterViewInit,TemplateRef } from '@angular/core';
import { Usuario } from 'src/app/features/sistemas/interface/usuario';
import { UsuarioService } from 'src/app/features/sistemas/services/usuario.service';
import { TransformadorPM1Service } from 'src/app/features/sistemas/services/transformador-pm1.service';
import { PM1Service } from 'src/app/features/sistemas/services/pm1.service';
import { ActivatedRoute } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AlertService } from 'src/app/features/sistemas/services/alert.service';
import { NotificacionService } from 'src/app/features/sistemas/services/notificacion.service';
import * as pdfjsLib from 'pdfjs-dist';
import { Notificacion } from 'src/app/features/sistemas/interface/notificacion';
import { PdfViewerComponent } from 'src/app/shared/components/pdf-viewer/pdf-viewer.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzModalRef } from 'ng-zorro-antd/modal/modal-ref';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { string } from '@amcharts/amcharts4/core';

import { PM1 } from 'src/app/features/sistemas/interface/pm1';

interface Mediciones {
  label: string;
  valores?: string[]; // Valores opcionales para entradas múltiples
  valor?: string; // Valor único opcional
  opciones?: string[]; // Opciones en caso de ser un campo seleccionable
}

export interface Item {
  label: string; // Etiqueta del campo
  tipo: 'valores' | 'opciones'; // Tipo del campo
  valores?: number[]; // Para valores reales y testigos
  opciones?: string[]; // Lista de opciones disponibles
  valor?: string; // Valor seleccionado
}

export interface Equipo {
  seleccionados: string[];      // Lista de seleccionados
  valorReal?: number[];        // Lista de valores reales
  valorTestigo?: number[];     // Lista de valores testigo
}

export interface Formulario {
  items: Item[];
}

export interface Transformador {
  form1?: Formulario;
  form2?: Formulario;
  form3?: Formulario;
  form4?: Formulario;
  imagen?: string;
}

@Component({
  selector: 'app-pm1-inspection',
  standalone: true,
  imports: [SharedModule,NzModalModule],
  providers: [
    NzModalService, // Ensure the service is provided here
  ],
  templateUrl: './pm1-inspection.component.html',
  styleUrl: './pm1-inspection.component.css'
})
export class Pm1InspectionComponent implements OnInit{

   transformadorData: any;
  usuarios: Usuario[] = [];
  usuariosMap: Map<number, Usuario> = new Map();
  correoSeleccionado = '';
  correoSeleccionado1 = '';
  rutaFirmaSeleccionada = '';
  fotocheckSeleccionado: number | null = null;
  fotocheckSeleccionado1: number | null = null;
  idusuario = 0;
  idusuario2 = 0;
   ubicacion: string = '';
   subestacion: string = '';
   transformador: string = '';
   id_transformadores:string = '';

   transformador1: any = {
    form1: { estadosGenerales: [], mediciones: [] },
    form2: { estadosGenerales: [], mediciones: [] },
    imagen: null,
  };

  transformador2: any = {
    form3: { estadosGenerales: [], mediciones: [] },
    form4: { estadosGenerales: [], mediciones: [] },
    imagen: null,
  };


  private annotations: any[] = [

  ];
  constructor(
    private transformadorService: TransformadorPM1Service,
    private usuarioService: UsuarioService,
    private alertservice:AlertService,
    private pm1Service: PM1Service,
    private route:ActivatedRoute,
    private NotificacionService :NotificacionService,
    private modal: NzModalService,
    private sanitizer: DomSanitizer,
    private messageService:NzMessageService,
      private notificationService:NzNotificationService,
  ) {

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.subestacion = params['subestacion'] || '';
      this.transformador = params['transformador'] || '';
      this.id_transformadores = params['id_transformadores'] || '';
      this.ubicacion = params['ubicacion'] || '';

      if (params['transformadorData']) {
        this.transformadorData = JSON.parse(params['transformadorData']);
        console.log("Datos del transformador:", this.transformadorData);

        // Validar y asignar transformadores
        this.transformador1 = this.transformadorData?.form1 && this.transformadorData?.form2 ? {
          form1: this.normalizeForm(this.transformadorData.form1),
          form2: this.normalizeForm(this.transformadorData.form2),
          imagen: this.transformadorData.imagen?.[0] || null,
        } : null;

        this.transformador2 = this.transformadorData?.form3 && this.transformadorData?.form4 ? {
          form3: this.normalizeForm(this.transformadorData.form3),
          form4: this.normalizeForm(this.transformadorData.form4),
          imagen: this.transformadorData.imagen2?.[0] || null,
        } : null;
      }
    });

    this.usuarioService.getUsers().subscribe(
      (usuarios: Usuario[]) => {
        this.usuarios = usuarios;
        this.usuarios.forEach(usuario => {
          this.usuariosMap.set(usuario.fotocheck, usuario);
        });
      },
      error => {
        console.error('Error al obtener la lista de usuarios:', error);
      }
    );
  }

  // Normalizar formularios para inicializar valores predeterminados
  normalizeForm(form: any): any {
    if (!form || !form.items) return null;
    return {
      ...form,
      items: form.items.map((item: any) => ({
        ...item,
        tipo: item.valores ? 'valores' : 'opciones' // Identificar tipo automáticamente
      }))
    };
  }




  horaInicio: string = '--:--';
horaFin: string = '--:--';
ordenTrabajo: string = '';
fechaOrden: string = '';
seguridadObservaciones = [
  { descripcion: 'Completar los permisos de trabajo según la actividad adjuntados a la OT (IPERC - ATS - PETAR PETS)', bueno: false, na: false, observaciones: '' },
  { descripcion: 'Inspección de herramientas y evitar exceso de carga (>25 kg)', bueno: false, na: false, observaciones: '' },
  { descripcion: 'Usar implementos de seguridad personal de acuerdo al tipo de trabajo (EPP\'s)', bueno: false, na: false, observaciones: '' },
  { descripcion: 'Realizar el aislamiento, bloqueo y confirmación energía cero de la sub estación eléctrica, evaluar', bueno: false, na: false, observaciones: '' }
];

potenciaActual: string = '';
corrienteActual: string = '';
patioObservaciones = [
  { descripcion:'Candados y manijas de puertas de acceso',bueno: false, malo: false, na: false, observaciones: '' },
  {descripcion:'Señalizacion de seguridad en cerco, transformador, bandejas', bueno: false, malo: false, na: false, observaciones: '' },
  { descripcion:'Bandejas porta cables',bueno: false, malo: false, na: false, observaciones: '' },
  { descripcion:'Sistema de iluminación y luces de emergencia en patio',bueno: false, malo: false, na: false, observaciones: '' }
];

recomendacionesObservaciones = [
  { descripcion: '', si: false, no: false, solicitud: '' },
  { descripcion: '', si: false, no: false, solicitud: '' },
  { descripcion: '', si: false, no: false, solicitud: '' },
  { descripcion: '', si: false, no: false, solicitud: '' },
  { descripcion: '', si: false, no: false, solicitud: '' }

];

async saveData() {
  this.modal.confirm({
    nzTitle: 'Confirmación',
    nzContent: '¿Estás seguro de que quieres guardar los datos?',
    nzOkText: 'Aceptar',
    nzCancelText: 'Cancelar',
    nzOnOk: async () => {
      const loadingMessageId = this.messageService.loading('Evaluando los datos, por favor espera...', { nzDuration: 0 }).messageId;

      try {
        // Formatear la fecha del formulario
        const fechaFormateada = this.convertirFechaFormato(this.fechaOrden);

        // Capturar datos de patio
        const patioObservaciones = this.patioObservaciones.map(obs => ({
          bueno: obs.bueno,
          malo: obs.malo,
          na: obs.na,
          observaciones: obs.observaciones,
        }));

        // Capturar datos de recomendaciones/avisos
        const avisoObservaciones = this.recomendacionesObservaciones.map(obs => ({
          observaciones: obs.descripcion,
          si: obs.si,
          no: obs.no,
          solicitud: obs.solicitud,
        }));

        // Función para procesar cada formulario
        const procesarFormularioAgrupado = (formulario: Formulario | undefined): Equipo | null => {
          if (!formulario) return null;

          const resultado: Equipo = {
            seleccionados: [],
            valorReal: [],
            valorTestigo: []
          };

          formulario.items.forEach((item: Item) => {
            if (item.tipo === 'valores' && item.valores?.length === 2) {
              const valorReal = item.valores[0];
              const valorTestigo = item.valores[1];

              if (valorReal !== null && valorTestigo !== null) {
                resultado.valorReal?.push(Number(valorReal));
                resultado.valorTestigo?.push(Number(valorTestigo));
              }
            } else if (item.tipo === 'opciones' && item.valor) {
              resultado.seleccionados.push(item.valor.trim());
            }
          });

          return resultado.seleccionados.length || (resultado.valorReal?.length || 0) || (resultado.valorTestigo?.length || 0) ? resultado : null;

        };

        const equipos: Equipo[] = [];

        const formulario1 = procesarFormularioAgrupado(this.transformador1?.form1);
        if (formulario1) equipos.push(formulario1);

        const formulario2 = procesarFormularioAgrupado(this.transformador1?.form2);
        if (formulario2) equipos.push(formulario2);

        const formulario3 = procesarFormularioAgrupado(this.transformador2?.form3);
        if (formulario3) equipos.push(formulario3);

        const formulario4 = procesarFormularioAgrupado(this.transformador2?.form4);
        if (formulario4) equipos.push(formulario4);

        if (equipos.length === 0) {
          this.alertservice.error('Error', 'Debe completar al menos un formulario correctamente.');
          this.messageService.remove(loadingMessageId);
          return;
        }

        console.log('Equipos agrupados:', equipos);



        // Crear el objeto para la API
        const pm1: PM1 = {
          hora_inicio: this.horaInicio,
          hora_fin: this.horaFin,
          orden_trabajo: this.ordenTrabajo,
          fecha: fechaFormateada,
          seguridad_observaciones: this.seguridadObservaciones,
          patio_observaciones: patioObservaciones,
          aviso_observaciones: avisoObservaciones,
          id_transformadores: parseInt(this.id_transformadores, 10),
          id_usuario: this.idusuario,
          id_usuario_2: this.idusuario2,
          potencia_actual: this.potenciaActual,
          corriente_actual: this.corrienteActual,
          equipos: equipos,
        };

        console.log('Objeto PM1 a enviar:', JSON.stringify(pm1, null, 2));

        // Llamar al servicio para guardar los datos
        const response = await this.pm1Service.postPM1(pm1).toPromise();
        const idPm1 = response;

        console.log('Respuesta del servicio postPM1:', response);

        if (idPm1) {
          const notificacion: Notificacion = {
            supervisor: this.idusuario2,
            lider: this.idusuario,
            firmado: false,
            id_pm1: idPm1,
          };

          // Crear notificación en la base de datos
          await this.NotificacionService.insertarNotificacionPm1(notificacion).toPromise();
          console.log('Notificación PM1 insertada correctamente');

          // Mostrar mensaje de éxito
          this.messageService.remove(loadingMessageId);
          this.alertservice.success('Datos Guardados', 'Los datos se han guardado con éxito.');
        } else {
          console.error('No se pudo obtener el ID de la PM1.');
          this.alertservice.error('Error', 'No se pudo obtener el ID de la PM1.');
          this.messageService.remove(loadingMessageId);
        }
      } catch (error) {
        console.error('Error al procesar los datos del formulario', error);
        this.messageService.remove(loadingMessageId);
        this.alertservice.error('Error al Guardar', 'Ha ocurrido un error inesperado al procesar los datos del formulario.');
      }
    },
  });
}










      // Método para convertir la fecha al formato dd-MM-yyyy
  convertirFechaFormato(fecha: string): string {
    if (!fecha) return ''; // Verificación si la fecha está vacía
    const [year, month, day] = fecha.split('-');
    return `${day}-${month}-${year}`;
  }
    isHttpErrorResponse(error: any): error is { error: { details?: string }, message?: string } {
      return error && typeof error === 'object' && ('error' in error || 'message' in error);
    }


    seleccionarParticipante(event: any, tipoCargo: string): void {
      const fotocheckSeleccionado = parseInt(event.target.value, 10);

      if (this.usuariosMap.has(fotocheckSeleccionado)) {
        const usuarioSeleccionado = this.usuariosMap.get(fotocheckSeleccionado)!;

        if (tipoCargo === 'TECNICO' && usuarioSeleccionado.cargo === 'TECNICO') {
          this.idusuario = usuarioSeleccionado.idUsuario;
          this.rutaFirmaSeleccionada = usuarioSeleccionado.firma;
          this.correoSeleccionado = usuarioSeleccionado.usuario;
          const campoCorreoTecnico = this.annotations.find(annotation => annotation.fieldName.toLowerCase() === 'correo_tecnico');
          if (campoCorreoTecnico?.element) campoCorreoTecnico.element.value = this.correoSeleccionado;
        } else if (tipoCargo === 'SUPERVISOR' && usuarioSeleccionado.cargo === 'SUPERVISOR') {
          this.idusuario2 = usuarioSeleccionado.idUsuario;
          //this.rutaFirmaSeleccionadaSupervisor = usuarioSeleccionado.firma;
          this.correoSeleccionado1 = usuarioSeleccionado.usuario;
          const campoCorreoSupervisor = this.annotations.find(annotation => annotation.fieldName.toLowerCase() === 'correo_supervisor');
          if (campoCorreoSupervisor?.element) campoCorreoSupervisor.element.value = this.correoSeleccionado1;
        } else {
          console.error('Operación no válida para el cargo.');
        }
      } else {
        console.error('Usuario no encontrado.');
      }
    }



  VerPlano(): void {
    this.transformadorService.MostrarPlano(this.subestacion, this.transformador).subscribe(
      (pdfBlob: Blob) => {
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Abrir el PDF en una nueva pestaña
        const newTab = window.open();
        if (newTab) {
          newTab.location.href = pdfUrl;
        } else {
          console.error('No se pudo abrir una nueva pestaña.');
          this.alertservice.error('No se pudo abrir el PDF en una nueva pestaña.', 'error');
        }
      },
      (error) => {
        console.error('Error inesperado', error);
        // Aquí puedes agregar un mensaje más descriptivo
        this.alertservice.error('No se encontró el plano', 'error');
      }
    );
  }

}
