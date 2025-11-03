
import { Component,ViewChild,TemplateRef } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { PM1Service } from 'src/app/features/sistemas/services/pm1.service';
import { TransformadorPM1Service } from 'src/app/features/sistemas/services/transformador-pm1.service';
import { PM1,BuscarPM1PorId } from 'src/app/features/sistemas/interface/pm1';

import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzModalRef } from 'ng-zorro-antd/modal/modal-ref';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DomSanitizer, SafeHtml,SafeResourceUrl  } from '@angular/platform-browser';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AlertService } from 'src/app/features/sistemas/services/alert.service';
import { PdfPm1Service } from './../../../sistemas/services/pdf-pm1.service';
import { TransformadoresService } from 'src/app/shared/services/transformadores.service';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-transformer-inspection',
  standalone: true,
  imports: [NzModalModule,SharedModule],
  templateUrl: './transformer-inspection.component.html',
  styleUrl: './transformer-inspection.component.css'
})

export class TransformerInspectionComponent {
  datos: any[] = [];
  filteredData: any[] = [];
  pdfUrl: SafeResourceUrl | null = null;
  @ViewChild('pdfModal', { static: false }) pdfModal!: TemplateRef<any>;
  pdfSrc: string = 'assets/pdf/pm1/pm1.pdf';
  pm1: BuscarPM1PorId | undefined;
  dtOptions: any = {};
  transformador: string | null = null;
  subestacion: string | null = null;
  voltage: string | null = null;
  potencia: string | null = null;


  filterFecha: string = '';
  filterOT: string = '';
  filterLider: string = '';
  filterSupervisor: string = '';

  mostrarHerramientas: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private pm1Service: PM1Service,
    private transformadorPM1Service: TransformadorPM1Service,
    private router: Router,
    private modal: NzModalService,
    private sanitizer: DomSanitizer,
    private messageService:NzMessageService,
    private alertservice: AlertService,
    private PdfPm1Service:PdfPm1Service,
    private TransformadoresService: TransformadoresService

  ) { }

  ngOnInit() {
    const storedCargo = localStorage.getItem('cargo');
    if (storedCargo) {
      this.mostrarHerramientas = storedCargo === 'SUPERVISOR';
    }
    this.route.queryParams.subscribe(params => {
      this.transformador = params['transformador'] || '';
      this.subestacion = params['subestacion'] || '';
      this.voltage = params['voltage'] || '';
      this.potencia = params['potencia'] || '';
      this.cargarDatos(this.transformador ?? '', this.subestacion ?? '');

      console.log("📩 Parámetros recibidos:", {
      transformador: this.transformador,
      subestacion: this.subestacion,
      voltage: this.voltage,
      potencia: this.potencia
  });
    });

    
  }



  cargarDatos(transformador: string, subestacion: string) {
    this.pm1Service.mostrarPM1(subestacion, transformador).subscribe(
      data => {
        this.datos = data;  // Asignar datos directamente
        this.filteredData = data;  // Inicialmente mostrar todos los datos
        console.log("datos", this.datos);
        this.cargarPdf(subestacion, transformador); // Llama a cargar el PDF
      },
      error => {
        console.error('Error al cargar los datos', error);
      }
    );
  }
  applyFilter(): void {
    this.filteredData = this.datos.filter(item => {
      return (
        (!this.filterFecha || item.fecha.includes(this.filterFecha)) &&
        (!this.filterOT || item.orden_trabajo.includes(this.filterOT)) &&
        (!this.filterLider || item.usuario.includes(this.filterLider)) &&
        (!this.filterSupervisor || item.usuario_2.includes(this.filterSupervisor))
      );
    });
  }

cargarPdf(subestacion: string, transformador: string) {
    this.transformadorPM1Service.getPdf(subestacion, transformador).subscribe(
      (response: Blob) => {
        const fileURL = URL.createObjectURL(response);
        this.pdfSrc = fileURL;
      },
      error => {
        console.error('Error al cargar el PDF', error);
      }
    );
}



eliminarRegistro(id_pm1: number): void {
  // Mostrar el modal de confirmación
  this.modal.confirm({
    nzTitle: 'Confirmación',
    nzContent: '¿Estás seguro de que quieres eliminar pm1?',
    nzOkText: 'Aceptar',
    nzCancelText: 'Cancelar',
    nzOnOk: async () => {
      // Mostrar mensaje de carga mientras se realiza la operación
      const loadingMessageId = this.messageService.loading('Evaluando los datos, por favor espera...', { nzDuration: 0 }).messageId;

      // Llamar al servicio para eliminar el registro
      this.pm1Service.eliminarPM1(id_pm1).subscribe({
        next: () => {
          // Eliminar el mensaje de carga
          this.messageService.remove(loadingMessageId);

          // Mostrar mensaje de éxito
          this.alertservice.success('pm1 eliminar', 'Los datos se han eliminado con éxito.');

          // Depuración: Confirmar que el registro fue eliminado
          console.log(`El registro con id_pm1 = ${id_pm1} se eliminó correctamente.`);

          // Actualizar la tabla
          this.actualizarTabla(id_pm1);
        },
        error: (err) => {
          // Eliminar el mensaje de carga
          this.messageService.remove(loadingMessageId);

          // Mostrar mensaje de error
          this.alertservice.error('Error', 'No se pudo eliminar el registro. Por favor, intenta de nuevo.');

          // Depuración: Mostrar el error en la consola
          console.error(`Error al intentar eliminar el registro con id_pm1 = ${id_pm1}`, err);
        }
      });
    },
    nzOnCancel: () => {
      this.alertservice.warning('Cancelado', 'La eliminación ha sido cancelada.');
    }
  });
}

actualizarTabla(id_pm1: number): void {
  // Buscar el índice del objeto con el id_pm1 en el array de datos
  const index = this.datos.findIndex(item => item.id_pm1 === id_pm1);

  // Si se encuentra, eliminar el objeto del array de datos
  if (index !== -1) {
    this.datos.splice(index, 1); // Eliminar el elemento del array
    this.datos = [...this.datos]; // Actualizar el array para que NG-ZORRO detecte los cambios
  }

  // Depuración: Confirmar que la tabla se ha actualizado
  console.log(`La fila con id_pm1 = ${id_pm1} ha sido eliminada de la tabla.`);
}


async abrirpdf(id: number): Promise<void> {
  try {
    console.log("🧩 Parámetros actuales antes de abrir PDF:", {
      subestacion: this.subestacion,
      transformador: this.transformador
    });

    // 1️⃣ Obtener los datos del PM1
    const data = await this.pm1Service.getPM1ById(id).toPromise();
    if (!data) return console.error('❌ No se encontró PM1');

    // 2️⃣ Validar parámetros
    if (!this.transformador || !this.subestacion) {
      console.warn("⚠️ No hay parámetros cargados, no se puede obtener imagen.");
      return;
    }

    // 3️⃣ Obtener información del transformador
    const transformadorInfo = this.TransformadoresService.getTransformador(this.transformador || '');
    if (!transformadorInfo) {
      console.warn("⚠️ No se encontró información del transformador.");
      return;
    }

    // 4️⃣ Obtener rutas de imágenes (imagen y imagen2)
    const imagenPaths = [
      transformadorInfo.imagen?.[0],
      transformadorInfo.imagen2?.[0]
    ].filter(Boolean);

    console.log("🖼️ Imágenes detectadas:", imagenPaths);

    // 5️⃣ Convertir cada imagen a base64
    const imagenesBase64: string[] = [];

    for (const path of imagenPaths) {
      try {
        const res = await fetch(path!);
        if (!res.ok) {
          console.warn("⚠️ No se pudo acceder a la imagen:", path);
          continue;
        }

        const base64 = await this.convertToBase64(path!);
        if (base64) {
          imagenesBase64.push(base64);
          console.log("✅ Imagen convertida a base64:", path);
        } else {
          console.warn("⚠️ No se pudo convertir a base64:", path);
        }
      } catch (err) {
        console.error("⚠️ Error convirtiendo imagen:", path, err);
      }
    }

    // 6️⃣ Generar el PDF pasando todas las imágenes
    const pdfBlob = await this.PdfPm1Service.viewPdf(id, data, imagenesBase64);

    if (pdfBlob) {
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
      console.log('✅ Se generó y abrió el PDF para PM1:', data);
    }

  } catch (error) {
    console.error('💥 Error al generar el PDF:', error);
  }
}


// Helper convertir imagen local a base64
private async convertToBase64(path: string): Promise<string | null> {
  try {
    const res = await fetch(path);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.error('Error al convertir imagen:', e);
    return null;
  }
}





  abrirDashboard(): void {
    if (this.subestacion && this.transformador) {
      this.router.navigate(['/transformadores/grafico-pm1'], { queryParams: { subestacion: this.subestacion, transformador: this.transformador } });
    }
  }
}
