import { DashSpt2Service } from './../../services/dash-spt2.service';
import { Spt2Service } from './../../services/spt2.service';
import { PdfGeneratorServiceService } from '../../services/pdf-generator-service.service';
import { Component ,OnInit,ViewChild,TemplateRef} from '@angular/core';
import { Spt2 } from '../../interface/spt2';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzModalRef } from 'ng-zorro-antd/modal/modal-ref';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DomSanitizer, SafeHtml,SafeResourceUrl  } from '@angular/platform-browser';
import { Router } from '@angular/router';
import 'datatables.net';
import 'datatables.net-buttons';
import 'datatables.net-buttons/js/buttons.html5.js';
import 'datatables.net-buttons/js/buttons.print.js';

import 'jszip';
import 'pdfmake';
import 'pdfmake/build/vfs_fonts.js';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-history-spt2',
  standalone: true,
  imports: [SharedModule,NzModalModule],
  templateUrl: './history-spt2.component.html',
  styleUrl: './history-spt2.component.css'
})
export class HistorySpt2Component implements OnInit{
  spt2List: Spt2[] = [];
  modalRef: NzModalRef | null = null;

  @ViewChild('pdfModal', { static: true }) pdfModal!: TemplateRef<any>;
  pdfUrl: SafeResourceUrl | null = null;

  constructor(private spt2Service: Spt2Service, private router: Router,
    private pdfGeneratorService:PdfGeneratorServiceService,
    private Spt2Service:Spt2Service,
    private DashSpt2Service:DashSpt2Service,
    private sanitizer: DomSanitizer,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.spt2Service.mostrarListaSpt2().subscribe(
      (data: Spt2[]) => {
        this.spt2List = data;
        console.log("Lista de SPT2:", this.spt2List);
        this.initDataTable();
      },
      error => {
        console.error('Error al obtener la lista SPT2', error);
      }
    );
  }







  verTendencia(spt2: any) {
    const { tag_subestacion, ot, fecha, lider, supervisor, pat01, pat02, pat03, pat04 } = spt2;

    console.log("Datos pasados al servicio verTendencia:", {
      tag_subestacion, ot, fecha, lider, supervisor, pat01, pat02, pat03, pat04
    });

    this.Spt2Service.buscarPorSubestacion(tag_subestacion).subscribe(
      (resultados) => {
        this.DashSpt2Service.actualizarResultadosBúsqueda(resultados);
        this.router.navigate(['sistemas/grafico-spt2']);
      },
      (error) => {
        console.error('Error al buscar por subestación con tag:', error);
        // Lógica para manejar errores
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
          `)
          .appendTo('head');

      const table = $('#example').DataTable({
        dom: 'Brtipl',
        buttons: [
          {
            extend: 'excelHtml5',
            text: '<i class="fas fa-file-excel" style="color: green;"></i> Excel',
            className: 'btn btn-success'
          },
          {
            extend: 'pdfHtml5',
            text: '<i class="fas fa-file-pdf" style="color: red;"></i> PDF',
            className: 'btn btn-danger'
          },
          {
            extend: 'print',
            text: '<i class="fas fa-print" style="color: blue;"></i> Imprimir',
            className: 'btn btn-info'
          }
        ],
        data: this.spt2List,
        columns: [
          { data: 'tag_subestacion', title: 'Subestación' },
          { data: 'ot', title: 'Ot' },
          { data: 'fecha', title: 'Fecha' },
          { data: 'lider', title: 'Líder' },
          { data: 'supervisor', title: 'Supervisor' },
          { data: null, title: 'Tendencia' },  // Nueva columna "Tendencia"
          { data: null, title: 'Documentos' }, // Nueva columna "Documentos"
          { data: null, title: 'Herramientas' } // Nueva columna "Herramientas"
        ],
        columnDefs: [
          {
            targets: -3,  // Columna "Tendencia"
            orderable: false,
            render: (data, type, full, meta) => {
              return `
                <div class="btn-group">
                <button class="btn btn-xs btn-default tendencia-btn"
                    type="button"
                    title="Ver Tendencia"
                    data-tag-subestacion="${full.tag_subestacion}"
                    data-ot="${full.ot}"
                    data-fecha="${full.fecha}"
                    data-lider="${full.lider}"
                    data-supervisor="${full.supervisor}"
                    data-pat01="${full.pat01}"
                    data-pat02="${full.pat02}"
                    data-pat03="${full.pat03}"
                    data-pat04="${full.pat04}">
                    <i class="fa fa-chart-line"></i>
                </button>
              </div>
              `;
            }
          },
          {
            targets: -2,  // Columna "Documentos"
            orderable: false,
            render: (data, type, full, meta) => {
              return `
                <div class="btn-group">
                <button class="btn btn-xs btn-default documentos-btn"
                    type="button"
                    title="Ver Documentos"
                    data-tag-subestacion="${full.tag_subestacion}"
                    data-ot="${full.ot}">
                    <i class="fa fa-file-pdf"></i>
                </button>
              </div>
              `;
            }
          },
          {
            targets: -1,  // Columna "Herramientas"
            orderable: false,
            render: (data, type, full, meta) => {
              return `
                <div class="btn-group">
                  <button class="btn btn-xs btn-default eliminar-btn"
                      type="button"
                      title="Eliminar"
                      data-idspt2="${full.idSpt2}">
                      <i class="fa fa-trash"></i>
                  </button>
                </div>
              `;
            }
          }
        ],
        initComplete: function (settings, json) {
          const api = (this as any).api();
          api.columns().every(function (this: any) {
            const column = this;
            const header = $(column.header());

            // Agregar campo de búsqueda solo si la columna no es "Tendencia", "Documentos" o "Herramientas"
            if (column.index() < api.columns().nodes().length - 3) {
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

      // Eventos para los botones de "ver", "tendencia", "documentos", y "eliminar"
      $('#example').on('click', '.ver-btn', (event) => {
        const idSpt2 = $(event.currentTarget).data('idspt2');
       // this.abrirDetalle(idSpt2);
      });

      $('#example').on('click', '.tendencia-btn', (event) => {
        const target = $(event.currentTarget);

        const tag_subestacion = target.data('tag-subestacion');
        const ot = target.data('ot');
        const fecha = target.data('fecha');
        const lider = target.data('lider');
        const supervisor = target.data('supervisor');
        const pat01 = target.data('pat01');
        const pat02 = target.data('pat02');
        const pat03 = target.data('pat03');
        const pat04 = target.data('pat04');

        // Pasar todos los datos al método verTendencia
        this.verTendencia({
          tag_subestacion,
          ot,
          fecha,
          lider,
          supervisor,
          pat01,
          pat02,
          pat03,
          pat04
        });
      });


      $('#example').on('click', '.documentos-btn', (event) => {
        const tag_subestacion = $(event.currentTarget).data('tag-subestacion');
        const ot = $(event.currentTarget).data('ot');
        this.verDocumentos(tag_subestacion, ot);  // Pasa los parámetros correctos
      });



      $('#example').on('click', '.eliminar-btn', (event) => {
        const idSpt2 = $(event.currentTarget).data('idspt2');
        //this.eliminarRegistro(idSpt2);  // Función para manejar la eliminación del registro
      });
    });
  }

  verDocumentos(tag_subestacion: string, ot: string): void {
    console.log(tag_subestacion, ot);

    this.pdfGeneratorService.generarPDF(tag_subestacion, ot).then((pdfBlob: Blob) => {
      const pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        URL.createObjectURL(pdfBlob)+ '#toolbar=0'
      );

      this.pdfUrl = pdfUrl;  // Asegúrate de que esta variable esté bien escrita
      console.log('PDF URL:', pdfUrl);  // Debugging

      this.modal.create({
        nzTitle: 'PDF Document',
        nzContent: this.pdfModal,  // Verifica que pdfModal esté bien referenciado
        nzFooter: null,
        nzWidth: 1200
      });
      console.log('Modal abierto con éxito');  // Debugging
    }).catch(error => {
      console.error('Error opening PDF:', error);
    });
  }





}
