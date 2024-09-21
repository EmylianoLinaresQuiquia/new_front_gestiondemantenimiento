import { Component,OnInit,ViewEncapsulation, ViewChild, ElementRef,AfterViewInit,TemplateRef } from '@angular/core';
import { Usuario } from 'src/app/features/sistemas/interface/usuario';
import { UsuarioService } from 'src/app/features/sistemas/services/usuario.service';
import { TransformadorPM1Service } from 'src/app/features/sistemas/services/transformador-pm1.service';
import { PM1Service } from 'src/app/features/sistemas/services/pm1.service';
import { ActivatedRoute } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AlertService } from 'src/app/features/sistemas/services/alert.service';
import { NotificacionService } from 'src/app/features/sistemas/services/notificacion.service';
import * as pdfjsLib from 'pdfjs-dist';
import { Notificacion } from 'src/app/features/sistemas/interface/notificacion';
import { PdfViewerComponent } from 'src/app/shared/components/pdf-viewer/pdf-viewer.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzModalRef } from 'ng-zorro-antd/modal/modal-ref';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
@Component({
  selector: 'app-pm1-inspection',
  standalone: true,
  imports: [SharedModule,NzModalModule],
  providers: [
    NzModalService, // Ensure the service is provided here
  ],
  templateUrl: './pm1-inspection.component.html',
  styleUrl: './pm1-inspection.component.css'
})
export class Pm1InspectionComponent implements OnInit{
  private transformadorData: any;
  usuarios: Usuario[] = [];
  correoSeleccionado = '';
  correoSeleccionado1 = '';
  rutaFirmaSeleccionada = '';
  fotocheckSeleccionado: number | null = null;
  fotocheckSeleccionado1: number | null = null;
  idusuario = 0;
  idusuario2 = 0;
  private ubicacion: string = '';


  private subestacion: string = '';
  private transformador: string = '';
  private id_transformadores:string = '';

  @ViewChild('pdfContainer', { static: false }) pdfContainer!: ElementRef;

  @ViewChild('pdfModal', { static: true }) pdfModal!: TemplateRef<any>;
  pdfUrl: SafeResourceUrl | null = null;
  modalRef: NzModalRef | null = null;
  zoomLevel: number = 1;
  private annotations: any[] = [

  ];


  constructor(
    private transformadorService: TransformadorPM1Service,
    private usuarioService: UsuarioService,
    private alertservice:AlertService,
    private pm1Service: PM1Service,
    private route:ActivatedRoute,
    private NotificacionService :NotificacionService,
    private modal: NzModalService,
    private sanitizer: DomSanitizer,
    private messageService:NzMessageService,
      private notificationService:NzNotificationService,
  ) {
    // Configura la ruta del worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    this.initializeOpcionesSelect();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.subestacion = params['subestacion'] || '';
      this.transformador = params['transformador'] || '';
      this.id_transformadores = params['id_transformadores'] || '';
      this.ubicacion = params['ubicacion'] || '';

      if (this.subestacion && this.transformador) {
        this.transformadorService.getPdf(this.subestacion, this.transformador).subscribe(blob => {
          try {
            const url = window.URL.createObjectURL(blob);
            this.loadPdf(url);
          } catch (error) {
            console.error('Error al procesar el blob del PDF:', error);
          }
        }, error => {
          console.error('Error al descargar el PDF:', error);
        });
      }
    });

    this.usuarioService.getUsers().subscribe(
      (usuarios: Usuario[]) => this.usuarios = usuarios,
      error => {
        console.error('Error al obtener la lista de usuarios:', error);
      }
    );
  }




 /* ngAfterViewInit() {
    this.loadPdf(this.getAbsoluteUrl('assets/pdf/pm1/Minas/pm1.pdf'));
  }*/

    getAbsoluteUrl(relativeUrl: string): string {
      return new URL(relativeUrl, window.location.origin).href;
    }

    loadPdf(url: string) {
      try {
        pdfjsLib.getDocument(url).promise.then(pdf => {
          pdf.getPage(1).then(page => {
            const scale = 2.5;
            const viewport = page.getViewport({ scale });
            const canvas = this.pdfContainer.nativeElement.querySelector('canvas');
            const context = canvas.getContext('2d');

            canvas.width = viewport.width;
            canvas.height = viewport.height;
            this.pdfContainer.nativeElement.style.width = `${viewport.width}px`;
            this.pdfContainer.nativeElement.style.height = `${viewport.height}px`;

            page.render({ canvasContext: context, viewport }).promise.then(() => {
              this.renderAnnotations(page, viewport);
            }).catch(error => {
              throw new Error('Error al renderizar la página del PDF');
            });
          }).catch(error => {
            console.error('Detailed error on page load:', error);
            throw new Error('Error al obtener la página del PDF');
          });
        }).catch(error => {
          console.error('Detailed error on document load:', error);
          throw new Error('Error al obtener el documento PDF.');
        });
      } catch (error) {
        console.error('Error inesperado:', error);
        this.alertservice.showAlert('Error inesperado al cargar el PDF.', 'error');
      }
    }



    renderAnnotations(page: any, viewport: any) {
      page.getAnnotations({ intent: 'display' }).then((annotations: any[]) => {
        this.annotations = annotations.map(annotation => ({
          ...annotation,
          ...this.annotations.find(a => a.fieldName === annotation.fieldName) // Merge existing annotation data
        }));

        const annotationLayerDiv = this.pdfContainer.nativeElement.querySelector('.annotationLayer');
        annotationLayerDiv.innerHTML = '';

        this.annotations.forEach(annotation => {
          if (annotation.subtype === 'Widget' && annotation.fieldType) {
            const input = this.createInputElement(annotation, viewport);
            if (input) {
              annotationLayerDiv.appendChild(input);
            } else {
              console.warn('No se pudo crear el elemento de entrada para la anotación:', annotation);
            }
          }
        });

        this.populateFields(); // Aquí se llama a populateFields
      });
    }



    opcionesSelect: any = {};
    initializeOpcionesSelect() {
      const baseOptions = {
        'value0': 'buen estado',
        'value1': 'mal estado'
      };

      for (let i = 1; i <= 35; i++) {
        this.opcionesSelect[`caja${i}`] = { ...baseOptions };
      }
    }
    private createInputElement(annotation: any, viewport: any): HTMLElement | null {
      if (!annotation.rect) {
        console.warn('Annotation without rect:', annotation);
        return null;
      }

      const [x1, y1, x2, y2] = annotation.rect;
      const rect = viewport.convertToViewportRectangle([x1, y1, x2, y2]);
      const x = rect[0], y = rect[1] - 20, width = rect[2] - rect[0], height = Math.max(rect[3] - rect[1], 20);

      let input: HTMLElement | null = null;
      const fieldName = annotation.fieldName ? annotation.fieldName.toLowerCase() : '';

      if (annotation.fieldType === 'Tx') {
        input = document.createElement('input');
        (input as HTMLInputElement).type = fieldName.includes('fecha') || fieldName.includes('date') ? 'date' :
                         fieldName.includes('hora') || fieldName.includes('time') ? 'time' : 'text';
        (input as HTMLInputElement).value = annotation.fieldValue !== undefined ? annotation.fieldValue : '';

        // Configura los campos SUBESTACION, TRANSFORMADOR y UBICACION como readonly
        if (fieldName.includes('subestacion') || fieldName.includes('transformador') || fieldName.includes('ubicacion')) {
          (input as HTMLInputElement).readOnly = true;
        }

        if (fieldName === 'fotocheck_tecnico') {
          input.addEventListener('change', (event: Event) => this.seleccionarParticipante(event, 'TECNICO'));
          input.style.border = '1px solid #000'; // Borde para fotocheck_tecnico
        } else if (fieldName === 'fotocheck_supervisor') {
          input.addEventListener('change', (event: Event) => this.seleccionarParticipante(event, 'SUPERVISOR'));
          input.style.border = '1px solid #000'; // Borde para fotocheck_supervisor
        } else if (fieldName.startsWith('ingresado_')) {
          input.style.border = '1px solid #000'; // Borde para campos ingresado_1, ingresado_2, etc.
        } else {
          input.style.border = 'none'; // Eliminar borde para otros campos de texto
          input.style.outline = 'none'; // Eliminar resplandor al enfocar para otros campos de texto
        }
      } else if (annotation.fieldType === 'Btn' && annotation.checkBox) {
        input = document.createElement('input');
        (input as HTMLInputElement).type = 'checkbox';
        (input as HTMLInputElement).checked = annotation.fieldValue === 'Yes' || annotation.fieldValue === true;
        input.style.border = 'none'; // Eliminar borde para checkboxes
        input.style.outline = 'none'; // Eliminar resplandor al enfocar para checkboxes
      } else if (annotation.fieldType === 'Ch') {
        input = document.createElement('select');

        // Verificar y añadir las opciones del PDF
        if (annotation.options && Array.isArray(annotation.options)) {
          annotation.options.forEach((option: any, index: number) => { // Specify 'any' type for option and 'number' for index
            const optionElement = document.createElement('option');
            optionElement.value = option.value !== undefined ? option.value : `value${index}`;
            optionElement.text = option.displayValue !== undefined ? option.displayValue : `Option ${index}`;
            input!.appendChild(optionElement); // Add a non-null assertion to 'input'
          });
        } else {
          console.warn('No options found for select field:', annotation);
        }

        // Asegurarse de que una opción esté seleccionada
        if (annotation.fieldValue !== undefined) {
          (input as HTMLSelectElement).value = annotation.fieldValue;
        } else {
          (input as HTMLSelectElement).selectedIndex = 0;
        }

        // Añadir event listener para capturar el valor seleccionado
        input.addEventListener('change', (event: Event) => {
          const target = event.target as HTMLSelectElement; // Add a type assertion
          if (target) {
            annotation.fieldValue = target.value;
          }
        });

        // Aplicar borde a los campos select
        input.style.border = '1px solid #000'; // Borde para los campos select
      } else {
        console.warn('Unsupported field type:', annotation.fieldType);
        return null;
      }

      Object.assign(input.style, {
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        pointerEvents: 'auto'
      });

      annotation.element = input;
      return input;
    }



    extractFormData() {
      const formData: { [key: string]: string | boolean } = {};  // Explicitly define the type of formData

      this.annotations.forEach(annotation => {
        if (annotation.subtype === 'Widget' && annotation.fieldType) {
          const fieldName = annotation.fieldName || '';
          const element = annotation.element;

          if (element) {
            if (element.tagName === 'INPUT') {
              if (element.type === 'checkbox') {
                formData[fieldName] = element.checked;
              } else {
                if (fieldName.includes('fecha') || fieldName.includes('date')) {
                  // Format date from YYYY-MM-DD to DD/MM/YYYY
                  const dateValue = element.value || '';
                  const [year, month, day] = dateValue.split('-');
                  formData[fieldName] = `${day}/${month}/${year}`;
                } else {
                  formData[fieldName] = element.value || '';
                }
              }
            } else if (element.tagName === 'SELECT') {
              const exportValue = element.value !== '.' ? element.value : '';
              if (this.opcionesSelect[fieldName] && this.opcionesSelect[fieldName][exportValue]) {
                formData[fieldName] = this.opcionesSelect[fieldName][exportValue];
              } else {
                formData[fieldName] = exportValue;
              }
            } else {
              formData[fieldName] = annotation.fieldValue || '.';
            }
          } else {
            formData[fieldName] = annotation.fieldValue || '.';
          }
        }
      });

      return formData;
    }

    async saveData() {
      this.modal.confirm({
        nzTitle: 'Confirmación',
        nzContent: '¿Estás seguro de que quieres guardar los datos?',
        nzOkText: 'Aceptar',
        nzCancelText: 'Cancelar',
        nzOnOk: async () => {
          const loadingMessageId = this.messageService.loading('Evaluando los datos, por favor espera...', { nzDuration: 0 }).messageId;
          try {
            const formData = this.extractFormData();
            console.log("Extracted Form Data en saveData:", formData);

            if (Object.keys(formData).length === 0) {
              console.warn("formData está vacío.");
              return;
            }

            const seguridadObservaciones = this.buildObservaciones(formData, 'SeguridadObservacion', 4, ['bueno', 'n', 'observacion']);
            const patioObservaciones = this.buildObservaciones(formData, 'PatioEstadoObservaciones', 4, ['bueno', 'malo', 'na', 'observacion']);
            const observacionesAvisoSolicitud = this.buildObservaciones(formData, 'ObservacionesAvisoSolicitud', 5, ['observacion', 'si', 'no', 'solicitud']);
            const equipos = this.buildEquipos(formData);

            const pm1 = {
              hora_inicio: typeof formData['hora_inicio'] === 'string' ? formData['hora_inicio'] : '',
              hora_fin: typeof formData['hora_fin'] === 'string' ? formData['hora_fin'] : '',
              orden_trabajo: typeof formData['orden_trabajo'] === 'string' ? formData['orden_trabajo'] : '',
              fecha: typeof formData['fecha'] === 'string' ? formData['fecha'] : '',
              seguridad_observaciones: seguridadObservaciones,
              patio_observaciones: patioObservaciones,
              aviso_observaciones: observacionesAvisoSolicitud,
              id_transformadores: parseInt(this.id_transformadores), // Verificación
              id_usuario: this.idusuario,
              id_usuario_2: this.idusuario2,
              potencia_actual: typeof formData['potencia_actual'] === 'string' ? formData['potencia_actual'] : '',
              corriente_actual: typeof formData['corriente_actual'] === 'string' ? formData['corriente_actual'] : '',
              equipos: equipos
            };

            console.log("PM1 Object:", pm1);

            try {
              const response = await this.pm1Service.postPM1(pm1).toPromise();
              const idPm1 = response.id_pm1;

              console.log("PM1 guardado correctamente");

              const notificacion: Notificacion = {
                id_usuario: this.idusuario,
                firmado: true,
                id_pm1: idPm1
              };

              await this.NotificacionService.insertarNotificacionPm1(notificacion).toPromise();
              console.log("Notificación PM1 insertada correctamente");

              this.messageService.remove(loadingMessageId);
              this.notificationService.success('Datos Guardados', 'Los datos se han guardado con éxito.');
            } catch (error) {
              if (error instanceof Error) {
                console.error("Error durante el proceso de guardado", error);
                this.messageService.remove(loadingMessageId);
                this.notificationService.error('Error al Guardar', 'Ha ocurrido un error inesperado al guardar los datos.');
              } else {
                console.error("Error desconocido durante el proceso de guardado", error);
                this.notificationService.error('Error al Guardar', 'Ha ocurrido un error inesperado al guardar los datos.');
              }
            }
          } catch (error) {
            console.error("Error al extraer los datos del formulario", error);
            this.messageService.remove(loadingMessageId);
          }
        }
      });
    }


    toBoolean(value: any): boolean {
      return value === 'true' || value === true;
    }

    buildObservaciones(formData: any, prefix: string, count: number, fields: string[]): any[] {
      const observacionesArray = [];
      for (let i = 0; i < count; i++) {
        const observacion: any = {};  // Utilizar un nombre temporal diferente aquí
        fields.forEach(field => {
          const key = `${prefix}_${field}${i + 1}`;
          const value = formData[key];
          // Mapea el campo correcto
          if (field === 'observacion') {
            observacion['observaciones'] = value; // Asegúrate de mapearlo a "observaciones"
          } else {
            observacion[field] = (field === 'na' || field === 'bueno' || field === 'si' || field === 'no') ? this.toBoolean(value) : value;
          }
          console.log(`Extraído ${key}: ${value}`);  // Añadir log para depurar
        });
        observacionesArray.push(observacion);  // Utilizar el nombre temporal aquí
      }
      console.log("Observaciones construidas:", observacionesArray);  // Log built observaciones array
      return observacionesArray;  // Devolver el array de observaciones
    }

    buildEquipos(formData: any): any[] {
      const equipos = [];
      let i = 1;
      while (true) {
        const seleccionado = formData[`caja${i}`];
        const ingresado = formData[`ingresado_${i}`];
        if (!seleccionado && !ingresado) break;
        equipos.push({ seleccionado, ingresado });
        console.log(`Equipo añadido: seleccionado=${seleccionado}, ingresado=${ingresado}`);  // Log added equipment
        i++;
      }
      console.log("Equipos construidos:", equipos);  // Log built equipos array
      return equipos;
    }

    seleccionarParticipante(event: any, tipoCargo: string): void {
      const fotocheckSeleccionado = parseInt(event.target.value, 10);
      const usuarioSeleccionado = this.usuarios.find(usuario => usuario.fotocheck === fotocheckSeleccionado);

      if (usuarioSeleccionado) {
        if (tipoCargo === 'TECNICO' && usuarioSeleccionado.cargo === 'TECNICO') {
          this.idusuario = usuarioSeleccionado.idUsuario;
          this.rutaFirmaSeleccionada = usuarioSeleccionado.firma;
          this.correoSeleccionado = usuarioSeleccionado.usuario;
          const campoCorreoTecnico = this.annotations.find(annotation => annotation.fieldName.toLowerCase() === 'correo_tecnico');
          if (campoCorreoTecnico?.element) campoCorreoTecnico.element.value = this.correoSeleccionado;
          this.crearCampoImagenFirma(this.rutaFirmaSeleccionada);
        } else if (tipoCargo === 'SUPERVISOR' && usuarioSeleccionado.cargo === 'SUPERVISOR') {
          this.idusuario2 = usuarioSeleccionado.idUsuario;
          this.correoSeleccionado1 = usuarioSeleccionado.usuario;
          const campoCorreoSupervisor = this.annotations.find(annotation => annotation.fieldName.toLowerCase() === 'correo_supervisor');
          if (campoCorreoSupervisor?.element) campoCorreoSupervisor.element.value = this.correoSeleccionado1;
        } else {
          console.error("Operación no válida para el cargo.");
        }
      } else {
        console.error("Usuario no encontrado.");
      }
    }

  crearCampoImagenFirma(rutaFirma: string) {
    const annotationLayerDiv = this.pdfContainer.nativeElement.querySelector('.annotationLayer');
    const img = document.createElement('img');
    Object.assign(img.style, { position: 'absolute', left: '100px', top: '136.2rem', width: '90px', height: '50px' });
    img.src = rutaFirma;
    annotationLayerDiv.appendChild(img);
  }


  populateFields() {
    this.annotations.forEach(annotation => {
      if (annotation.fieldType === 'Tx' && annotation.fieldName) {
        const fieldName = annotation.fieldName.toLowerCase();

        // Inicializar valores para SUBESTACION, TRANSFORMADOR y UBICACION
        if (fieldName.includes('subestacion')) {
          annotation.element.value = this.subestacion;
          annotation.element.readOnly = true;
        } else if (fieldName.includes('transformador')) {
          annotation.element.value = this.transformador;
          annotation.element.readOnly = true;
        } else if (fieldName.includes('ubicacion')) {
          annotation.element.value = this.ubicacion;
          annotation.element.readOnly = true;
        }

        // Añadir otros campos según sea necesario
      }
    });
  }


  VerPlano(): void {
    this.transformadorService.MostrarPlano(this.subestacion, this.transformador).subscribe(
      (pdfBlob: Blob) => {
        const pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          URL.createObjectURL(pdfBlob) + '#toolbar=0'
        );
        this.pdfUrl = pdfUrl;

        this.modal.create({
          nzTitle: 'PDF Document',
          nzContent: this.pdfModal,
          nzFooter: null,
          nzWidth: 1200
        });
      },
      (error) => {
        console.error('Error al abrir el PDF:', error);
      }
    );
  }

  zoomIn(): void {
    this.zoomLevel += 0.2;  // Incrementa el zoom en 20%
  }

  zoomOut(): void {
    if (this.zoomLevel > 0.4) {
      this.zoomLevel -= 0.2;  // Reduce el zoom en 20%, pero no por debajo del 40% del tamaño original
    }
  }






}
