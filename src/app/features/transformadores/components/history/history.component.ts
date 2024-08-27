import { Component } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PM1Service } from 'src/app/features/sistemas/services/pm1.service';
import { TransformadorPM1Service } from 'src/app/features/sistemas/services/transformador-pm1.service';
import { Router } from '@angular/router';
import 'datatables.net';
import 'datatables.net-buttons';
import 'datatables.net-buttons/js/buttons.html5.js';
import 'datatables.net-buttons/js/buttons.print.js';

import 'jszip';
import 'pdfmake';
import 'pdfmake/build/vfs_fonts.js';
@Component({
  selector: 'app-history',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent {
  transformador: any[] = [];

  constructor(
    private PM1Service: PM1Service,
    private router: Router,
    private transformadorService: TransformadorPM1Service
  ) {}

  ngOnInit() {
    this.transformadorService.getTransformadores().subscribe((data) => {
      this.transformador = data;
      console.log("this.pm1", this.transformador);
      this.initDataTable();
    });
  }

  abrirpruebas(transformador: string, subestacion: string, voltage: string, potencia: string) {
  this.router.navigate(['transformadores/inseccion-pm1'], {
    queryParams: {
      transformador: transformador,
      subestacion: subestacion,
      voltage: voltage,
      potencia: potencia
    }
  });
  console.log("transformador:", transformador, "subestacion:", subestacion, "voltage:", voltage, "potencia:", potencia);
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

      // Inicializar DataTable
      const table = $('#example').DataTable({
          dom: 'Brtipl', // 'B' incluye los botones de exportación
          buttons: [
              {
                  extend: 'excelHtml5',
                  text: '<i class="fas fa-file-excel" style="color: green;"></i> Excel',
                  className: 'btn btn-success' // Clase para el estilo del botón
              },
              {
                  extend: 'pdfHtml5',
                  text: '<i class="fas fa-file-pdf" style="color: red;"></i> PDF',
                  className: 'btn btn-danger' // Clase para el estilo del botón
              },
              {
                  extend: 'print',
                  text: '<i class="fas fa-print" style="color: blue;"></i> Imprimir',
                  className: 'btn btn-info' // Clase para el estilo del botón
              }
          ],
          data: this.transformador,
          columns: [
              { data: 'subestacion', title: 'SUBESTACION' },
              { data: 'ubicacion', title: 'UBICACION' },
              { data: 'transformador', title: 'TRANSFORMADOR' },
              { data: 'tipo', title: 'TIPO' },
              { data: 'marca', title: 'MARCA' },
              { data: 'voltage', title: 'TENSION(Kv)' },
              { data: 'potencia', title: 'POTENCIA(MVA)' },
              { data: null, title: 'Resumen' } // Esta es la columna sin buscador
          ],
          columnDefs: [
              {
                  targets: -1,
                  orderable: false,
                  render: (data, type, full, meta) => {
                      return `
                          <div class="btn-group">
                              <button class="btn btn-xs btn-default ver-btn"
                                  type="button"
                                  title="Ver"
                                  data-transformador="${full.transformador}"
                                  data-subestacion="${full.subestacion}"
                                  data-voltage="${full.voltage}"
                                  data-potencia="${full.potencia}">
                                  <i class="fa fa-eye"></i>
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

      // Posicionar botones de exportación
      $('.dt-buttons').addClass('float-right');

      // Evento para el botón "ver"
      $('#example').on('click', '.ver-btn', (event) => {
          const transformador = $(event.currentTarget).data('transformador');
          const subestacion = $(event.currentTarget).data('subestacion');
          const voltage = $(event.currentTarget).data('voltage');
          const potencia = $(event.currentTarget).data('potencia');
          this.abrirpruebas(transformador, subestacion, voltage, potencia);
      });
  });
}
}
