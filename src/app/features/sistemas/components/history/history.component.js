"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryComponent = void 0;
var core_1 = require("@angular/core");
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
var HistoryComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-history',
            standalone: true,
            imports: [],
            templateUrl: './history.component.html',
            styleUrl: './history.component.css'
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var HistoryComponent = _classThis = /** @class */ (function () {
        function HistoryComponent_1() {
        }
        return HistoryComponent_1;
    }());
    __setFunctionName(_classThis, "HistoryComponent");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        HistoryComponent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return HistoryComponent = _classThis;
}();
exports.HistoryComponent = HistoryComponent;
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
