import { Component ,OnInit} from '@angular/core';
import { Spt2 } from '../../interface/spt2';
import { Spt2Service } from '../../services/spt2.service';
import { Router } from '@angular/router';

import 'datatables.net';
import 'datatables.net-buttons';
import 'datatables.net-buttons/js/buttons.html5.js';
import 'datatables.net-buttons/js/buttons.print.js';

import 'jszip';
import 'pdfmake';
import 'pdfmake/build/vfs_fonts.js';

@Component({
  selector: 'app-history-spt2',
  standalone: true,
  imports: [],
  templateUrl: './history-spt2.component.html',
  styleUrl: './history-spt2.component.css'
})
export class HistorySpt2Component implements OnInit{
  spt2List: Spt2[] = [];

  constructor(private spt2Service: Spt2Service, private router: Router) {}

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

  abrirDetalle(idSpt2: number) {
    this.router.navigate(['ruta/detalle-spt2'], {
      queryParams: {
        idSpt2: idSpt2
      }
    });
    console.log("Navegando a los detalles de SPT2 con ID:", idSpt2);
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
          { data: 'fecha', title: 'Fecha' },
          { data: 'lider', title: 'Líder' },
          { data: 'supervisor', title: 'Supervisor' },
          { data: null, title: 'Resumen' }
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
                      data-idspt2="${full.idSpt2}">
                      <i class="fa fa-eye"></i>
                  </button>
                </div>
              `;
            }
          }
        ],
        initComplete: function (this: any) {
          const api = this.api(); // `this` refers to the DataTable instance
          api.columns().every(function (this: any) { // Explicitly type `this` again inside this function
            const column = this;
            const header = $(column.header());

            if (column.index() !== api.columns().nodes().length - 1) {
              const input = $('<input type="text" placeholder="Buscar..." />')
                .appendTo(header)
                .on('keyup change', function () {
                  if (column.search() !== (this as HTMLInputElement).value) {
                    column.search((this as HTMLInputElement).value).draw();
                  }
                });
            }
          });
        }.bind(this) // Ensure `this` refers to the Angular component
         // `bind(this)` asegura que `this` sea el componente Angular
      });
      // Evento para el botón "ver"
      $('#example').on('click', '.ver-btn', (event) => {
        const idSpt2 = $(event.currentTarget).data('idspt2');
        this.abrirDetalle(idSpt2);
      });
    });
  }
}
