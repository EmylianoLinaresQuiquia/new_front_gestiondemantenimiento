import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
/*import { Spt2 } from '../../interface/spt2';
import { Spt2Service } from '../../services/spt2.service';
import { DashSpt2Service } from '../../services/dash-spt2.service';
import { MetodoCaida } from '../../interface/metodo-caida';
import { MetodoSelectivo } from '../../interface/metodo-selectivo';
import { MetodoCaidaService } from '../../services/metodo-caida.service';
import { MetodoSelectivoService } from '../../services/metodo-selectivo.service';
import { SubestacionService } from '../../services/subestacion.service';
//import { PdfGeneratorServiceService } from '../../services/pdf-generator-service.service';
import { UsuarioService } from '../../services/usuario.service';
import { AuthServiceService } from '../../services/auth-service.service';
*/

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent {
  /*spt2Data: Spt2[] = [];

  constructor(
    private spt2Service: Spt2Service,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.spt2Service.mostrarListaSpt2().subscribe((data: Spt2[]) => {
      this.spt2Data = data;
      console.log("data",this.spt2Data)
      this.initDataTable();
    });
  }

  initDataTable() {
    $(document).ready(() => {
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
        data: this.spt2Data,
        columns: [
          { data: 'propiedad1', title: 'Propiedad 1' },
          { data: 'propiedad2', title: 'Propiedad 2' },
          { data: 'propiedad3', title: 'Propiedad 3' },
          { data: null, title: 'Acciones' }
        ],
        columnDefs: [
          {
            targets: -1,
            orderable: false,
            render: (data: any, type: any, full: any, meta: any) => {
              return `
                <div class="btn-group">
                  <button class="btn btn-xs btn-default ver-btn"
                    type="button"
                    title="Ver Detalles"
                    data-id="${full.id}">
                    <i class="fa fa-eye"></i>
                  </button>
                </div>
              `;
            }
          }
        ],
        initComplete: () => {
          const api = table;
          api.columns().every(function () {
            const column = this;
            if (column.index() !== api.columns().nodes().length - 1) {
              $('<input type="text" placeholder="Buscar..." />')
                .appendTo($(column.header()))
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
        this.verDetalles(id);
      });
    });
  }

  verDetalles(id: string) {
    this.router.navigate(['ruta-a-detalle'], { queryParams: { id: id } });
  }*/
}


/*

spt2list: Spt2[] = [];
  MetodoCaidaData: string[] = [];
  MetodoSelectioData: string[] = [];

  tagSubestacion: string = '';
  ot: string = '';
  fecha: string = '';
  area: string = '';
  plano: string = '';
  fechaplano: string = '';
  version: string = '';
  firma?: boolean;
  userEmail?: string;
  mensajeExito: string | null = null;
  loading: boolean = true;
  spt2: Spt2 | null = null;
  selectedSpt2: Spt2 | null = null;
  selectedOption?: string;
  filtroActual: string = '';
  userId?: number;
  eliminado: string = '';
  selectedOptions: { [id: number]: string } = {};

  constructor(
    private Spt2Service: Spt2Service,
    private dashSpt2Service: DashSpt2Service,
    private authService: AuthServiceService,
    private SubestacionService: SubestacionService,
    //private pdfGeneratorService: PdfGeneratorServiceService,
    private MetodoCaidaService: MetodoCaidaService,
    private MetodoSelectivoService: MetodoSelectivoService,
    //private confirmationService: ConfirmationService,
    //private messageService: MessageService,
    private UsuarioService: UsuarioService,
    private router: Router
  ) {
    //this.firma = false;  // Inicialización en el constructor
    //this.selectedOption = '';  // Inicialización en el constructor}
  }
  pat01Value: string | null = null;
  pat02Value: string | null = null;
  pat03Value: string | null = null;
  pat04Value: string | null = null;
  metodocaidavalue: string | null = null;
  metodoselectivovalue: string | null = null;
  dataCaida: MetodoCaida[] = [];
  dataSelectivo: MetodoSelectivo[] = [];
  verificacionCaida$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  verificacionSelectivo$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
    // Cargar los datos de Spt2
    this.Spt2Service.mostrarListaSpt2().subscribe(
      (data: Spt2[]) => {
        let spt2ListModificada = data.map(item => {
          // Modificar los valores de pat1, pat2, pat3 y pat4
          item.pat1 = this.agregarTextoBueno(item.pat1);
          item.pat2 = this.agregarTextoBueno(item.pat2);
          item.pat3 = this.agregarTextoBueno(item.pat3);
          item.pat4 = this.agregarTextoBueno(item.pat4);

          // Verificar si al menos uno de los campos pat tiene un valor no vacío, no nulo y diferente de '0'
          if ((item.pat1 && item.pat1 !== '0bueno' && item.pat1 !== '0malo') ||
              (item.pat2 && item.pat2 !== '0bueno' && item.pat2 !== '0malo') ||
              (item.pat3 && item.pat3 !== '0bueno' && item.pat3 !== '0malo') ||
              (item.pat4 && item.pat4 !== '0bueno' && item.pat4 !== '0malo')) {
            item.selectedOption = 'SIN PICAS';
          } else {
            item.selectedOption = '';
          }

          return item;
        });

        this.spt2list = spt2ListModificada.sort((a, b) => (b.idSpt2 ?? 0) - (a.idSpt2 ?? 0));

        this.loading = false;

        if (this.spt2list.length > 0) {
          this.tipospt2(this.spt2list[0]);
        }

        this.initDataTable(); // Inicializar la tabla después de cargar los datos
      },
      (error: any) => {
        console.error('Error al cargar la lista de SPT2:', error);
        this.loading = false;
      }
    );
  }
  invertirFormatoFecha(fecha: string): string {
    const [year, month, day] = fecha.split('-');
    return `${day}-${month}-${year}`;
  }


    esNumeroValido(valor: any): boolean {
      return !isNaN(valor) && isFinite(valor);
    }



  initDataTable() {
    $(document).ready(() => {
      $('<style>')
        .prop('type', 'text/css')
        .html(`
          #example tbody tr:hover {
            background-color: #dfdfdf !important;
          }
        `)
        .appendTo('head');

        const table = ($('#example') as any).DataTable({
          dom: 'Bfrtip',  // Ajuste en 'dom'buttons: [
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
        data: this.spt2list,
        columns: [
          { data: 'tag_subestacion', title: 'Subestación' },
          { data: 'ot', title: 'OT' },
          { data: 'fecha', title: 'Fecha' },
          { data: 'pat1', title: 'Pat1' },
          { data: 'pat2', title: 'Pat2' },
          { data: 'pat3', title: 'Pat3' },
          { data: 'pat4', title: 'Pat4' },
          { data: 'selectedOption', title: 'Opciones' },
          { data: null, title: 'Acciones' }
        ],
        columnDefs: [
          {
            targets: -1,
            orderable: false,
            render: (data: any, type: any, full: any, meta: any) => {
              return `
              <div class="btn-group">
                  <button class="btn btn-xs btn-default ver-btn"
                  type="button"
                  title="Ver"
                  data-tag_subestacion="${full.tag_subestacion}"
                  data-ot="${full.ot}"
                  data-fecha="${full.fecha}"
                  data-pat1="${full.pat1}"
                  data-pat2="${full.pat2}"
                  data-pat3="${full.pat3}"
                  data-pat4="${full.pat4}">
                  <i class="fa fa-eye"></i>
                  </button>
              </div>
              `;
            }
          }
        ],

        initComplete: function (this: any) {  // Especifica que 'this' es de tipo 'any' en este contexto
          const tableApi = this.api();  // Almacena la referencia de 'this'

          tableApi.columns().every(function (this: any) {  // Especifica 'any' aquí también para 'this' dentro de esta función
            const column = this;
            const header = $(column.header());

            if (column.index() !== tableApi.columns().nodes().length - 1) {
              const input = $('<input type="text" placeholder="Buscar..." />')
                .appendTo(header)
                .on('keyup change', function () {
                  const inputValue = (this as HTMLInputElement).value;  // Asegúrate de que 'this' es un 'HTMLInputElement'
                  if (column.search() !== inputValue) {
                    column.search(inputValue).draw();
                  }
                });
            }
          });
        }


      }as any);

      $('.dt-buttons').addClass('float-right');

      $('#example').on('click', '.ver-btn', (event) => {
        const tagSubestacion = $(event.currentTarget).data('tag_subestacion');
        const ot = $(event.currentTarget).data('ot');
        const fecha = $(event.currentTarget).data('fecha');
        const pat1 = $(event.currentTarget).data('pat1');
        const pat2 = $(event.currentTarget).data('pat2');
        const pat3 = $(event.currentTarget).data('pat3');
        const pat4 = $(event.currentTarget).data('pat4');
        this.abrirDashboardSpt2({ tag_subestacion: tagSubestacion, ot, fecha, pat1, pat2, pat3, pat4 });
      });
    });
  }

  abrirDashboardSpt2(spt2: any) {
    const { tag_subestacion, ot } = spt2;
    this.Spt2Service.buscarPorSubestacion(tag_subestacion).subscribe(
      (resultados) => {
        this.dashSpt2Service.actualizarResultadosBúsqueda(resultados);
        this.router.navigate(['inicio/dashboard-spt2']);
      },
      (error) => {
        console.error('Error al buscar por subestación:', error);
      }
    );
  }

  agregarTextoBueno(valor: string | null): string {
    return valor !== '0' && valor !== '0bueno' && valor !== '0malo' && valor !== null && valor !== '' ? `${valor}bueno` : valor!;
  }


  tipospt2(spt2: Spt2) {
    this.spt2 = spt2;
    this.pat01Value = spt2.pat1;
    this.pat02Value = spt2.pat2;
    this.pat03Value = spt2.pat3;
    this.pat04Value = spt2.pat4;
    this.metodocaidavalue = spt2.id_mcaida.toString();
    this.metodoselectivovalue = spt2.id_mselectivo.toString();
  }*/
