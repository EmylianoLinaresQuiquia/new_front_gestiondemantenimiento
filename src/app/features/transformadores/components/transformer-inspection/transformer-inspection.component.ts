import { Component } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { PM1Service } from 'src/app/features/sistemas/services/pm1.service';
import { TransformadorPM1Service } from 'src/app/features/sistemas/services/transformador-pm1.service';
import { PM1,BuscarPM1PorId } from 'src/app/features/sistemas/interface/pm1';
@Component({
  selector: 'app-transformer-inspection',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './transformer-inspection.component.html',
  styleUrl: './transformer-inspection.component.css'
})
export class TransformerInspectionComponent {
  datos: any[] = [];
  pdfSrc: string = 'assets/pdf/pm1/Minas/pm1.pdf';
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
    //public dialog: MatDialog
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
    // Incluir el CSS para el hover
    $('<style>')
      .prop('type', 'text/css')
      .html(`
        #example tbody tr:hover {
          background-color: #dfdfdf !important;
        }
      `)
      .appendTo('head');

    // Inicializar DataTable
    const table = $('#example').DataTable({
      pagingType: 'full_numbers',
      pageLength: 10,
      dom: 'rtipl', // Eliminado 'B' para quitar los botones de exportación
      data: this.datos, // Asegúrate de que 'this.datos' es un array de objetos
      columns: [
        { data: 'fecha', title: 'Fecha', width: '80px' },
        { data: 'orden_trabajo', title: 'OT', width: '60px' },
        { data: 'usuario', title: 'Lider',width: '80px' },
        { data: 'usuario_2', title: 'Supervisor',width: '80px' },
        { data: null, title: 'Acciones', width: '80px' } // Columna sin buscador
      ],
      columnDefs: [
        {
          targets: -1,
          orderable: false,
          searchable: false,
          render: (data, type, full, meta) => {
            return `
              <div class="btn-group">
                <button class="btn btn-xs btn-default ver-btn" type="button" title="Ver" data-id="${full.id_pm1}">
                  <i class="fa fa-eye"></i>
                </button>
              </div>
            `;
          }
        },
        { width: '200px', targets: 0 }
      ],
      scrollX: true,
      scrollY: '300px',
      scrollCollapse: true,
      initComplete: function (settings, json) {
    const api = (this as any).api();
    api.columns().every(function (this: any) {
        const column = this;
        const header = $(column.header());

        // Agregar campo de búsqueda solo si la columna no es "Resumen"
        if (column.index() !== api.columns().nodes().length - 1) {
            const input = $('<input type="text" placeholder="" />')
                .appendTo(header)
                .on('keyup change', function () {
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
      //this.abrirpdf(id);
    });
  });
}




  /*abrirpdf(id: number) {
    this.pm1Service.getPM1ById(id).subscribe(
      (data: BuscarPM1PorId) => {
        this.pm1 = data;
        this.dialog.open(PdfViewerDialogComponent, {
          data: { pdfSrc: this.pdfSrc, pm1: this.pm1 }, // Usa el pdfSrc
          width: '80%',
          height: '80rem'
        });
        console.log('Abrir pruebas para id:', id, 'con datos:', this.pm1);
      },
      (error: any) => {
        console.error('Error al cargar los datos de PM1 por ID', error);
      }
    );
  }*/

  abrirDashboard(): void {
    if (this.subestacion && this.transformador) {
      this.router.navigate(['/transformadores/grafico-pm1'], { queryParams: { subestacion: this.subestacion, transformador: this.transformador } });
    }
  }


  /*onCloseClick(): void {
    this.dialog.closeAll();
  }*/
}
