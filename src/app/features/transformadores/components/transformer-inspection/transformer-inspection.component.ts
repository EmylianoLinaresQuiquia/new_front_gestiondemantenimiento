import { Component,ViewChild,TemplateRef } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { PM1Service } from 'src/app/features/sistemas/services/pm1.service';
import { TransformadorPM1Service } from 'src/app/features/sistemas/services/transformador-pm1.service';
import { PM1,BuscarPM1PorId } from 'src/app/features/sistemas/interface/pm1';
import { PdfViewerPm1Component } from 'src/app/shared/components/pdf-viewer-pm1/pdf-viewer-pm1.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzModalRef } from 'ng-zorro-antd/modal/modal-ref';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DomSanitizer, SafeHtml,SafeResourceUrl  } from '@angular/platform-browser';
@Component({
  selector: 'app-transformer-inspection',
  standalone: true,
  imports: [SharedModule,NzModalModule],
  templateUrl: './transformer-inspection.component.html',
  styleUrl: './transformer-inspection.component.css'
})
export class TransformerInspectionComponent {
  datos: any[] = [];
  pdfUrl: SafeResourceUrl | null = null;
  @ViewChild('pdfModal', { static: false }) pdfModal!: TemplateRef<any>;
  pdfSrc: string = 'assets/pdf/pm1/pm1.pdf';
  pm1: BuscarPM1PorId | undefined;
  dtOptions: any = {};
  transformador: string | null = null;
  subestacion: string | null = null;
  voltage: string | null = null;
  potencia: string | null = null;





  constructor(
    private route: ActivatedRoute,
    private pm1Service: PM1Service,
    private transformadorPM1Service: TransformadorPM1Service,
    private router: Router,
    private modal: NzModalService,
    private sanitizer: DomSanitizer

  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.transformador = params['transformador'] || '';
      this.subestacion = params['subestacion'] || '';
      this.voltage = params['voltage'] || '';
      this.potencia = params['potencia'] || '';
      this.cargarDatos(this.transformador ?? '', this.subestacion ?? '');
    });
  }

  selectTab(event: Event) {
    event.preventDefault();
    const clickedTab = event.target as HTMLElement;

    // Ocultar todos los contenidos
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.setAttribute('style', 'display: none;'));

    // Eliminar la clase activa de todos los enlaces
    const tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(link => link.parentElement?.classList.remove('active'));

    // Añadir la clase activa al enlace clicado
    clickedTab.parentElement?.classList.add('active');

    // Mostrar el contenido correspondiente
    const targetTab = clickedTab.getAttribute('data-tab');
    if (targetTab) {
      const targetElement = document.getElementById(targetTab);
      targetElement?.setAttribute('style', 'display: block;');
    }
  }
  cargarDatos(transformador: string, subestacion: string) {
    this.pm1Service.mostrarPM1(subestacion, transformador).subscribe(
      data => {
        this.datos = data;
        console.log("datos",this.datos)
        this.initDataTable();
        this.cargarPdf(subestacion, transformador); // Llama a cargar el PDF
      },
      error => {
        console.error('Error al cargar los datos', error);
      }
    );
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

initDataTable() {
  $(document).ready(() => {
    // Incluye el CSS para el hover
    $('<style>')
  .prop('type', 'text/css')
  .html(`
    #example tbody tr:hover {
      background-color: #dfdfdf !important;
    }

  `)
  .appendTo('head');


    // Inicializa DataTable
    const table = $('#example').DataTable({
      pagingType: 'full_numbers',
      pageLength: 10,
      dom: 'rtipl', // Eliminado 'B' para quitar los botones de exportación
      data: this.datos,
      columns: [
        { data: 'fecha', title: 'Fecha', width: '20%' },
        { data: 'orden_trabajo', title: 'OT', width: '20%' },
        { data: 'usuario', title: 'Lider', width: '25%' },
        { data: 'usuario_2', title: 'Supervisor', width: '25%' },
        { data: 'firma', title: 'Acciones', width: '10%' } // Columna sin buscador
      ],
      columnDefs: [
        {
          targets: -1,
          orderable: false,
          searchable: false,
          render: (data, type, full, meta) => {
           // Verificar el valor del campo firma
                const iconColor = full.firma ? 'green' : 'orange'; // Cambia el color según el valor de firma

                return `
                  <div class="btn-group">
                    <button class="btn btn-xs btn-default ver-btn" type="button" title="Ver" data-id="${full.id_pm1}">
                      <i class="fa fa-file-pdf" style="color: ${iconColor};"></i>
                    </button>
                  </div>
                `;
          }
        }
      ],
      scrollX: true,  // Habilita el scroll horizontal
      scrollY: '300px',  // Limita el alto de la tabla
      scrollCollapse: true,
      autoWidth: false,  // Desactiva el ajuste automático de ancho
      initComplete: function(settings, json) {
        const api = (this as any).api();
        api.columns().every((columnIdx: any) => {
          const column = api.column(columnIdx);
          const header = $(column.header());

          // Agregar campo de búsqueda solo si la columna no es "Acciones"
          if (columnIdx !== api.columns().nodes().length - 1) {
            const headerWidth = $(column.header()).width() || 100; // Asignar un valor predeterminado si el ancho es undefined
            const input = $('<input type="text" placeholder="" />')
              .css('width', headerWidth + 'px') // Establecer el ancho del input igual al ancho de la columna
              .appendTo(header)
              .on('keyup change', function() {
                if (column.search() !== (this as HTMLInputElement).value) {
                  column.search((this as HTMLInputElement).value).draw();
                }
              });
          }
        });
      }


    });

    // Evento para el botón "ver"
    $('#example').on('click', '.ver-btn', (event) => {
      const id = $(event.currentTarget).data('id');
       this.abrirpdf(id);
    });
  });
}

abrirpdf(id: number) {
  this.pm1Service.getPM1ById(id).subscribe(
    (data: BuscarPM1PorId) => {
      this.pm1 = data;

      if (this.pdfSrc && this.pm1) {
        this.modal.create({
          nzFooter: [
            {
              label: 'Cerrar',
              type: 'default',
              onClick: () => this.modal.closeAll(),
              className: 'custom-close-button' // Clase CSS personalizada para el botón
            },
            {
              label: 'Descargar PDF',
              type: 'primary',
              onClick: () => this.downloadPdf(this.pdfSrc),  // Usar pdfSrc en lugar de pdfBlob
            }
          ],
          nzContent: PdfViewerPm1Component,  // Componente que se abrirá en el modal
          nzData: {
            pdfSrc: this.pdfSrc,  // Asegúrate de que este valor esté correctamente asignado
            pm1: this.pm1         // El objeto `pm1` contiene los datos necesarios
          },
          nzWidth: '100%',            // Ajusta el ancho del modal
          nzStyle: { top: '20px' }, // Posicionar el modal en la parte superior
          nzClosable: false // Desactivar el botón "X" de cerrar
        });

        console.log('Modal abierto con PDF:', this.pdfSrc, 'y PM1:', this.pm1);
      } else {
        console.error('No se puede abrir el modal porque faltan datos.');
      }
    },
    (error: any) => {
      console.error('Error al cargar los datos de PM1 por ID', error);
    }
  );
}

downloadPdf(pdfSrc: string): void {
  const link = document.createElement('a');
  link.href = pdfSrc;
  link.download = 'pm1.pdf';  // Nombre de archivo para la descarga
  link.click();
}



  abrirDashboard(): void {
    if (this.subestacion && this.transformador) {
      this.router.navigate(['/transformadores/grafico-pm1'], { queryParams: { subestacion: this.subestacion, transformador: this.transformador } });
    }
  }


  /*onCloseClick(): void {
    this.dialog.closeAll();
  }*/
}
