import { Component, OnInit, Inject, PLATFORM_ID, OnChanges } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
/*import * as ExcelJS from 'exceljs';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import * as XLSX from 'xlsx';
import { SharedModule } from '../../../../shared/shared.module';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { isPlatformBrowser } from '@angular/common';*/
/*interface Cell {
  v: string; // o el tipo adecuado según tus datos
}

// Define el tipo para una fila, que es un array de celdas
type Row = (Cell | string)[];*/

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../interface/usuario';


import { Subestacion } from '../../interface/subestacion';
import { Notificacion } from '../../interface/notificacion';
import { SubestacionService } from '../../services/subestacion.service';
import { Spt1Service } from '../../services/spt1.service';
import { SeguridadobservacionService } from '../../services/seguridadobservacion.service';
import { BarraequiAiService } from '../../services/barraequi-ai.service';
import { BarraequiNoAiService } from '../../services/barraequi-no-ai.service';
import { CercopAiService } from '../../services/cercop-ai.service';
import { CercopNoAiService } from '../../services/cercop-no-ai.service';
import { TransformadorNoAiService } from '../../services/transformador-no-ai.service';
import { RecomendacionService } from '../../services/recomendacion.service';
import { TipostpService } from '../../services/tipostp.service';
import { NotificacionService } from '../../services/notificacion.service';
import { AuthServiceService } from '../../services/auth-service.service';
import { Pat1spt1Service } from '../../services/pat1spt1.service';
import { Pat2spt1Service } from '../../services/pat2spt1.service';
import { Pat3spt1Service } from '../../services/pat3spt1.service';
import { Pat4spt1Service } from '../../services/pat4spt1.service';
import { Spt1DTO } from '../../interface/spt1';
//import { PdfGeneratorPlanoService } from '../../services/pdf-generator-plano.service';

import { PdfViewerComponent } from 'src/app/shared/components/pdf-viewer/pdf-viewer.component';
//import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from '../../services/alert.service';
import { ActivatedRoute } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ChangeDetectorRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-spt1-inspection',
  standalone: true,
  imports: [SharedModule],
  providers: [
    NzModalService, // Ensure the service is provided here
  ],
  templateUrl: './spt1-inspection.component.html',
  styleUrl: './spt1-inspection.component.css'
})
export class Spt1InspectionComponent  {


    pozo_t_noAi: number = 0;
    pozo_t_Ai: number = 0;
    barra_e_noAi: number = 0;
    barra_e_Ai: number = 0;
    cerco_p_noAi: number = 0;
    cerco_p_Ai: number = 0;
    transformador_noAi: number = 0;
    recomendacion_lote_id: number = 0;
    id_tipostp: number = 0;
    pat1_spt1: number = 0;
    pat2_spt1: number = 0;
    pat3_spt1: number = 0;
    pat4_spt1: number = 0;
    id_spt1: number = 0;
    id_subestacion: number;
    userId?: number;
    images: File[] = [];
    subestacion: Subestacion | null = null;
    tagSubestacion: string = '';
    ot: string = '';
    fecha: string = '';
    ubicacion: string = '';
    plano: string = '';
    fechaplano: string = '';
    versio: string = '';
    inicio: string = '';
    fin: string = '';

    marca: string = '';
    nserie: string = '';
    modelo: string = '';
    frecuencia: string = '';
    precision: string = '';

    usuarios: Usuario[] = [];
    correoSeleccionado: string = '';
    fotocheckSeleccionado: number | null = null;
    rutaFirmaSeleccionada: string = '';

    correoSeleccionado1: string = '';
    fotocheckSeleccionado1: number | null = null;
    files: File[] = [];
    inputValues: number[] = [];
    cantidad_spt: number | null = null;
    colorSeleccionado: string = '';

    check1: boolean = false;
    check2: boolean = false;
    observacion1: string = '';
    check3: boolean = false;
    check4: boolean = false;
    observacion2: string = '';
    check5: boolean = false;
    check6: boolean = false;
    observacion3: string = '';
    check7: boolean = false;
    check8: boolean = false;
    observacion4: string = '';
    check9: boolean = false;
    check10: boolean = false;
    observacion5: string = '';

    aislado: boolean = false;
    contrapeso: boolean = false;
    horizontal: boolean = false;
    vertical: boolean = false;
    delta: boolean = false;
    malla: boolean = false;

    observacion6: string = '';
    observacion7: string = '';
    observacion8: string = '';
    aviso6: string = '';
    aviso7: string = '';
    aviso8: string = '';
    patValues: string[] = [];
    userEmail?: string;
    //items: MenuItem[] | undefined;

    constructor(
      private sanitizer: DomSanitizer,
      private usuarioService: UsuarioService,
      private subestacionService: SubestacionService,
      private Spt1Service: Spt1Service,
      private SeguridadobservacionService: SeguridadobservacionService,
      private BarraequiNoAiService: BarraequiNoAiService,
      private BarraequiAiService: BarraequiAiService,
      private CercopNoAiService: CercopNoAiService,
      private CercopAiService: CercopAiService,
      private TransformadorNoAiService: TransformadorNoAiService,
      private RecomendacionService: RecomendacionService,
      private authService: AuthServiceService,
      private TipostpService: TipostpService,
      //private PdfGeneratorPlanoService: PdfGeneratorPlanoService,
      private Pat1spt1Service: Pat1spt1Service,
      private Pat2spt2Service: Pat2spt1Service,
      private Pat3spt1Service: Pat3spt1Service,
      private Pat4spt1Service: Pat4spt1Service,
      //public dialog: MatDialog,
      private alertservice: AlertService,
      private route: ActivatedRoute,
      private messageService:NzMessageService,
      private notificationService:NzNotificationService,
      private modal: NzModalService,
      private notificacionService: NotificacionService
    ) {
      this.initializeOptions(48);

      this.id_subestacion = 0; // Ejemplo de valor predeterminado
      this.tecnicoIdUsuario = 0;
      this.supervisorIdUsuario = 0;
    }

    ngOnInit(): void {
      /*this.items = [
        {
          icon: 'pi pi-upload',
          command: () => {
            this.guardarDatos();
          }
        }
      ];*/
      this.route.queryParams.subscribe(params => {
        this.tagSubestacion = params['tag'] || '';
        this.ubicacion = params['ubicacion'] || '';
        this.plano = params['plano'] || '';
        this.cantidad_spt = params['cantidad_spt'] ? +params['cantidad_spt'] : null;
        this.id_subestacion = params['id_subestacion'] ? +params['id_subestacion'] : 0;
      });

      this.subestacionService.getSubestacionData().subscribe((data) => {
        console.log("data subestacion",data)
        if (data) {
          this.tagSubestacion = data.tag_subestacion || '';
          this.ubicacion = data.ubicacion || '';
          this.plano = data.plano || '';
          this.fechaplano = data.fecha || '';
          this.versio = data.version || '';
          this.cantidad_spt = data.cantidad_spt || null;
          this.files = [];
        }
      });

      this.usuarioService.getUsers().subscribe(
        (usuarios: Usuario[]) => {
          this.usuarios = usuarios;
          if (this.usuarios.length === 0) {
            console.error('No se obtuvieron usuarios.');
          }
        },
        (error: any) => {
          console.error('Error al obtener la lista de usuarios:', error);
        }
      );
    }

    getRange(): number[] {
      return Array.from({ length: this.cantidad_spt ?? 0 }, (_, index) => index);
    }

    getSelectClass(selectedOption: string): string {
      if (selectedOption === 'Buen Estado') {
        return 'select-green';
      } else if (selectedOption === 'No aplica') {
        return 'select-black';
      } else {
        return 'select-red';
      }
    }


    onSelectChange(index: number, event: Event): void {
      const select = event.target as HTMLSelectElement;
      this.selectedOptions[index] = select.value;  // Asegúrate de actualizar el array correcto
      console.log(`Valor seleccionado para option${index}:`, select.value);
    }

    barras_equipotencial: { [key: string]: string } = {};

    get_barras_equipotencial(optionKey: string, value: string) {
      this.barras_equipotencial[optionKey] = value;
    }

    cerco_perimetrico : { [key: string]: string } = {};
    get_cerco_perimetrico(optionKey: string, value: string){
      this.cerco_perimetrico[optionKey] = value;
    }

    transformador : { [key: string]: string } = {};
    get_transformador(optionKey: string, value: string){
      this.transformador[optionKey] = value;
    }



    tipo_spt1: string[] = [];

    updateTipoSPT1(value: string, isChecked: boolean) {
      if (isChecked) {
        this.tipo_spt1.push(value);
      } else {
        const index = this.tipo_spt1.indexOf(value);
        if (index > -1) {
          this.tipo_spt1.splice(index, 1);
        }
      }
    }


    idusuario = 0;
    tecnicoIdUsuario: number | null = null;
    supervisorIdUsuario: number | null = null;

    seleccionarParticipante(event: any, tipoCargo: string): void {
      const fotocheckSeleccionado = parseInt(event.target.value, 10);
      const usuarioSeleccionado = this.usuarios.find(usuario => usuario.fotocheck === fotocheckSeleccionado);

      if (usuarioSeleccionado) {
        console.log('Usuario seleccionado:', usuarioSeleccionado);

        if (tipoCargo === 'TECNICO' && usuarioSeleccionado.cargo === 'TECNICO') {
          this.tecnicoIdUsuario = usuarioSeleccionado.idUsuario;
          this.rutaFirmaSeleccionada = usuarioSeleccionado.firma || '';
          this.correoSeleccionado = usuarioSeleccionado.usuario || '';
        } else if (tipoCargo === 'SUPERVISOR' && usuarioSeleccionado.cargo === 'SUPERVISOR') {
          this.supervisorIdUsuario = usuarioSeleccionado.idUsuario;
          this.correoSeleccionado1 = usuarioSeleccionado.usuario || '';
        } else {
          console.error(`Error: Operación válida solo para ${tipoCargo.toLowerCase()}s, cargo actual: ${usuarioSeleccionado.cargo}`);
        }
      }
    }


    selectedOptions: string[] = ['', '', ''];
    colorSeleccionadoClasses: string[] = ['', '', ''];
    colorSeleccionadoClass: string = '';
    colorSeleccionadoClass1: string = '';
    selectedOption: string = '';
    selectedOption1: string = '';
    options: { [key: string]: { selected: string, colorClass: string } } = {};

    initializeOptions(count: number): void {
      this.options = {};  // Asegúrate de que options esté inicializado

      // Inicializa las opciones desde 0 hasta count - 1
      for (let i = 0; i < count; i++) {
        this.options[`selectedOption${i}`] = { selected: '', colorClass: '' };
      }

      // Agrega una opción predeterminada si es necesario
      this.options['pozos_a_tierra'] = { selected: '', colorClass: '' };
    }

    getOption(key: string): { selected: string, colorClass: string } {
      return this.options[key] || { selected: '', colorClass: '' };
    }

    getSelectedOptions(): string[] {
      // Filtra y devuelve solo las opciones seleccionadas que no están vacías
      return Object.keys(this.options)
        .filter(key => this.options[key].selected && this.options[key].selected !== '')
        .map(key => this.options[key].selected);
    }



    onGenerarPdfButtonClick(): void {
      const newTab = window.open('', '_blank'); // Abrir una nueva pestaña en blanco de inmediato

      if (!newTab) {
        // Si no se pudo abrir, mostrar error
        console.error('No se pudo abrir una nueva pestaña.');
        this.alertservice.error('No se pudo abrir el PDF en una nueva pestaña.', 'error');
        return;
      }

      // Llamada al servicio para obtener el PDF
      this.subestacionService.getPdfBySubestacion(this.tagSubestacion).subscribe(
        (pdfBlob: Blob) => {
          const blobUrl = URL.createObjectURL(pdfBlob);
          newTab.location.href = blobUrl; // Asignar el URL del PDF a la nueva pestaña
        },
        (error) => {
          console.error('Error inesperado', error);
          this.alertservice.error('No se encontró el Plano.', 'error');
          newTab.close(); // Cerrar la pestaña si hubo un error
        }
      );
    }









    seguridad_observacion: { checks: boolean[]; observacion: string }[] = [];

  observacion_avisos: { observacion: string; aviso: string }[] = [];
  pozos_a_tierra: string[] = [];

  guardarDatos(): void {
    console.log("Supervisor ID:", this.supervisorIdUsuario ?? 0, "Técnico ID:", this.tecnicoIdUsuario ?? 0);

  this.modal.confirm({
    nzTitle: 'Confirmación',
    nzContent: '¿Estás seguro de que quieres guardar los datos?',
    nzOkText: 'Aceptar',
    nzCancelText: 'Cancelar',
    nzOnOk: async () => {
      const loadingMessageId = this.messageService.loading('Evaluando los datos, por favor espera...', { nzDuration: 0 }).messageId;

      try {
        // Crear las observaciones y avisos en la estructura requerida
        const seguridad_observacione = [
          { checks: [this.check1, this.check2], observacion: this.observacion1 },
          { checks: [this.check3, this.check4], observacion: this.observacion2 },
          { checks: [this.check5, this.check6], observacion: this.observacion3 },
          { checks: [this.check7, this.check8], observacion: this.observacion4 },
          { checks: [this.check9, this.check10], observacion: this.observacion5 },
        ];
        this.seguridad_observacion = seguridad_observacione;

        const observacion_avisos = [
          { observacion: this.observacion6, aviso: this.aviso6 },
          { observacion: this.observacion7, aviso: this.aviso7 },
          { observacion: this.observacion8, aviso: this.aviso8 },
        ];
        this.observacion_avisos = observacion_avisos;


        const seguridad_observaciones = this.seguridad_observacion.map(item => item.observacion);
        const bueno = this.seguridad_observacion.map(item => item.checks[0] || false);
        const na = this.seguridad_observacion.map(item => item.checks[1] || false);

        const observacionAvisoList = this.observacion_avisos.map(item => item.observacion);
        const avisoList = this.observacion_avisos.map(item => item.aviso);

        // Convertir la fecha al formato dd-MM-yyyy
        const fechaFormateada = this.convertirFechaFormato(this.fecha);
        const spt1: Spt1DTO = {
          ot: this.ot ,
          fecha: fechaFormateada ,
          hora_inicio: this.inicio ,
          hora_fin: this.fin ,
          id_subestacion: this.id_subestacion ,
          id_usuario: this.tecnicoIdUsuario ?? 0,
          id_usuario_2: this.supervisorIdUsuario ?? 0,
          tipo_spt1: this.tipo_spt1?.length ? this.tipo_spt1 : [],

          observacion_aviso: observacionAvisoList,
         aviso: avisoList,
          seguridad_observaciones: seguridad_observaciones,
          bueno: bueno,
          na: na,

          barras_equipotenciales: this.barras_equipotencial ? Object.values(this.barras_equipotencial) : [],
          pozos_a_tierra: this.getSelectedOptions().length ? this.getSelectedOptions() : [],
          cerco_perimetrico: this.cerco_perimetrico ? Object.values(this.cerco_perimetrico) : [],
          transformadores: this.transformador ? Object.values(this.transformador) : []
        };

          console.log("Datos a enviar en spt1:", spt1);

          try {
            const response = await this.Spt1Service.insertarSpt1(spt1).toPromise();
            const idspt1 = response.id;

            if (idspt1) {
              console.log("Respuesta recibida:", response);

              const notificacion: Notificacion = {
                supervisor: this.supervisorIdUsuario ?? 0,
                lider: this.tecnicoIdUsuario ?? 0,
                firmado: false,
                id_spt1: idspt1
              };
              console.log("Datos de notificación:", notificacion);

              await this.notificacionService.insertarNotificacionSpt1(notificacion).toPromise();
              console.log("Notificación guardada correctamente");

              this.messageService.remove(loadingMessageId);
              this.alertservice.success('Datos Guardados', 'Los datos se han guardado con éxito.');
            } else {
              throw new Error('No se pudo obtener el ID de la spt1');
            }
          } catch (error) {
            this.handleErrorInterno(error, 'insertarSpt1', loadingMessageId);
          }
        } catch (error) {
          console.error("Error al procesar datos del formulario:", error);
          this.messageService.remove(loadingMessageId);
          this.alertservice.error('Error al Guardar', 'Ha ocurrido un error inesperado al procesar los datos del formulario.');
        }
      }
    });
}

handleErrorInterno(error: any, context: string, loadingMessageId: string) {
  console.error(`Error en ${context}:`, error);
  this.messageService.remove(loadingMessageId);

  // Mostramos el error completo en la alerta
  this.alertservice.error('Error al Guardar', error.message);
}



// Método para convertir la fecha al formato dd-MM-yyyy
convertirFechaFormato(fecha: string): string {
  if (!fecha) return ''; // Verificación si la fecha está vacía

  const [year, month, day] = fecha.split('-');
  return `${day}-${month}-${year}`;
}





}



