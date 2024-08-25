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
exports.InspectionPageComponent = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var card_1 = require("ng-zorro-antd/card");
var InspectionPageComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-inspection-page',
            standalone: true,
            imports: [common_1.CommonModule, forms_1.FormsModule, forms_1.ReactiveFormsModule, card_1.NzCardModule],
            templateUrl: './inspection-page.component.html',
            styleUrl: './inspection-page.component.css'
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var InspectionPageComponent = _classThis = /** @class */ (function () {
        function InspectionPageComponent_1() {
            this.tagSubestacion = '';
            //subestaciones: Subestacion[] = [];
            this.tagsSubestaciones = [];
            /*private subscriptions = new Subscription();
        
            constructor(private router: Router,
              private subestacionService: SubestacionService) {
        
              }
        
            ngOnInit() {
              this.subestacionService.MostrarSubestaciones().subscribe((data: Subestacion[]) => {
                this.subestaciones = data;
                this.tagsSubestaciones = data.map(subestacion => subestacion.tag_subestacion);
              }, error => {
                console.error('Error al obtener subestaciones', error);
              });
            }
        
            ngOnDestroy() {
              this.subscriptions.unsubscribe();
            }
        
            buscarSubestacion(): void {
              if (this.tagSubestacion === 'SPT1') {
                const subestacionSeleccionada = this.subestaciones.find(s => s.tag_subestacion === this.tagSubestacion);
                if (subestacionSeleccionada) {
                  this.router.navigate(['/inicio/spt01'], {
                    queryParams: {
                      tag: subestacionSeleccionada.tag_subestacion,
                      ubicacion: subestacionSeleccionada.ubicacion,
                      plano: subestacionSeleccionada.plano,
                      cantidad_spt: subestacionSeleccionada.cantidad_spt
                    }
                  });
                } else {
                  console.error('Subestación no encontrada');
                }
              }
            }
        
        
        
            seleccionarOpcion(tipo: Tipo, evento: Event): void {
              const inputElement = evento.target as HTMLSelectElement;
              if (inputElement && inputElement.value) {
                const opcion: Opcion = inputElement.value as Opcion;
        
                const rutas: Record<Tipo, Record<Opcion, string>> = {
                  'spt1': {
                    'Protocolo': '/inicio/spt01',
                    'Historico': '/inicio/tabla-historial-spt1'
                  },
                  'spt2': {
                    'Protocolo': '/inicio/spt02',
                    'Historico': '/inicio/tabla-historial-spt2'
                  }
                };
        
                const rutaSeleccionada = rutas[tipo][opcion];
        
                if (opcion === 'Historico') {
                  this.router.navigate([rutaSeleccionada]);
                } else {
                  const subestacionSeleccionada = this.subestaciones.find(s => s.tag_subestacion === this.tagSubestacion);
                  if (subestacionSeleccionada) {
                    this.router.navigate([rutaSeleccionada], {
                      queryParams: {
                        tag: subestacionSeleccionada.tag_subestacion,
                        ubicacion: subestacionSeleccionada.ubicacion,
                        plano: subestacionSeleccionada.plano,
                        cantidad_spt: subestacionSeleccionada.cantidad_spt
                      }
                    });
                  } else {
                    console.error('Subestación no encontrada para redirigir.');
                  }
                }
              }
            }
        
            abrirspt1(){
              this.router.navigate(['/spt1'])
            }*/
        }
        return InspectionPageComponent_1;
    }());
    __setFunctionName(_classThis, "InspectionPageComponent");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InspectionPageComponent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InspectionPageComponent = _classThis;
}();
exports.InspectionPageComponent = InspectionPageComponent;
