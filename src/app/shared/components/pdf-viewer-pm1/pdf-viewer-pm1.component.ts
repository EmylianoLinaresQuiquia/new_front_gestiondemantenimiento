

import { Component, Inject, OnInit, ViewChild, ElementRef,Input,AfterViewInit } from '@angular/core';
//import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { BuscarPM1PorId,PM1 } from 'src/app/features/sistemas/interface/pm1';
import { PDFDocument, rgb, StandardFonts, PDFTextField, PDFCheckBox,PDFDropdown,PDFFont } from 'pdf-lib';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import * as pdfjsLib from 'pdfjs-dist';
import * as pdfjsViewer from 'pdfjs-dist/web/pdf_viewer';


@Component({
  selector: 'app-pdf-viewer-pm1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pdf-viewer-pm1.component.html',
  styleUrl: './pdf-viewer-pm1.component.css'
})
/*export class PdfViewerPm1Component {
  pdfSrc: string;
  pm1: BuscarPM1PorId;
  filledPdf: string | ArrayBuffer | null = null;


  @ViewChild('pdfViewerpm', { static: false }) pdfViewerpm!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit - PDF Viewer Element:', this.pdfViewerpm);

    if (this.pdfViewerpm && this.pdfViewerpm.nativeElement) {
      console.log('Canvas está disponible:', this.pdfViewerpm.nativeElement);

      if (this.pdfSrc) {
        this.loadPdfFromSrc();
      } else if (this.pm1) {
        this.fillPdf();
      }
    } else {
      console.error('Canvas no está disponible después de ngAfterViewInit.');
    }
  }


  constructor(
    @Inject(NZ_MODAL_DATA) public data: any,
    private modal: NzModalRef,
    private http: HttpClient
  ) {
    this.pdfSrc = data.pdfSrc;
    this.pm1 = data.pm1 || null;

    // Depuración en el constructor
    console.log('Constructor - PDF Source:', this.pdfSrc);
    console.log('Constructor - PM1 Data:', this.pm1);
  }
  ngOnInit(): void {
    // Depuración al iniciar
    console.log('ngOnInit - PDF Source:', this.pdfSrc);
    console.log('ngOnInit - PM1 Data:', this.pm1);

    // Inicializamos el trabajador de PDF.js
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    // Dependiendo si tenemos PDF o datos de PM1, ejecutamos una acción
    if (this.pdfSrc) {
      this.loadPdfFromSrc();
    } else if (this.pm1) {
      console.log('Datos de PM1 antes de llenar PDF:', this.pm1);
      this.fillPdf();
    }
  }


  createFieldMappings(pm1: any): { [key: string]: string | boolean } {
    const fieldMappings: { [key: string]: string | boolean } = {};

    // Asignar valores directos de pm1 a los campos del formulario
    fieldMappings['tag_subestacion'] = pm1.tag_subestacion || '';
    fieldMappings['ubicacion'] = pm1.ubicacion || '';
    fieldMappings['hora_inicio'] = pm1.hora_inicio || '';
    fieldMappings['hora_fin'] = pm1.hora_fin || '';
    fieldMappings['orden_trabajo'] = pm1.orden_trabajo || '';
    fieldMappings['correo_supervisor'] = pm1.correo_supervisor || '';
    fieldMappings['correo_tecnico'] = pm1.correo_tecnico || '';
    fieldMappings['corriente_actual'] = pm1.corriente_actual || '';
    fieldMappings['fecha'] = pm1.fecha || '';
    fieldMappings['fotocheck_supervisor'] = pm1.fotocheck_supervisor || '';
    fieldMappings['fotocheck_tecnico'] = pm1.fotocheck_tecnico || '';
    fieldMappings['potencia_actual'] = pm1.potencia_actual || '';
    fieldMappings['transformador'] = pm1.transformador || '';




    // Asignar valores de los equipos
    if (pm1.equipos) {
      const equipos = pm1.equipos.split(',').map((e: string) => e.split('|'));

      equipos.forEach((equipo: string[], index: number) => {
      // Usa un índice dinámico para cada caja y campo ingresado
      fieldMappings[`ingresado_${index + 1}`] = equipo[1] || '';
      fieldMappings[`caja${index + 1}`] = equipo[0] || '';

      // Verifica los campos de campo mapeados
      console.log(`Campo asignado: ingresado_${index + 1} = ${fieldMappings[`ingresado_${index + 1}`]}`);
      console.log(`Campo asignado: caja${index + 1} = ${fieldMappings[`caja${index + 1}`]}`);
    });
  }

    // Asignar valores de las observaciones de aviso
    if (pm1.aviso_observaciones) {
      const avisoObservaciones = pm1.aviso_observaciones.split(',').map((a: string) => a.split('|'));

      avisoObservaciones.forEach((obs: string[], index: number) => {
        fieldMappings[`ObservacionesAvisoSolicitud_observacion${index + 1}`] = obs[0] || '';
        fieldMappings[`ObservacionesAvisoSolicitud_si${index + 1}`] = obs[1] === '1';
        fieldMappings[`ObservacionesAvisoSolicitud_no${index + 1}`] = obs[2] === '1';
        fieldMappings[`ObservacionesAvisoSolicitud_solicitud${index + 1}`] = obs[3] || '';
      });
    }

    // Asignar valores de las observaciones del patio
    if (pm1.patio_observaciones) {
      const patioObservaciones = pm1.patio_observaciones.split(',').map((p: string) => p.split('|'));

      patioObservaciones.forEach((obs: string[], index: number) => {
        fieldMappings[`PatioEstadoObservaciones_observacion${index + 1}`] = obs[3] || '';
        fieldMappings[`PatioEstadoObservaciones_bueno${index + 1}`] = obs[0] === '1';
        fieldMappings[`PatioEstadoObservaciones_malo${index + 1}`] = obs[1] === '1';
        fieldMappings[`PatioEstadoObservaciones_na${index + 1}`] = obs[2] === '1';
      });
    }

    // Asignar valores de las observaciones de seguridad
    if (pm1.seguridad_observaciones) {
      const seguridadObservaciones = pm1.seguridad_observaciones.split(',').map((s: string) => s.split('|'));

      seguridadObservaciones.forEach((obs: string[], index: number) => {
        fieldMappings[`SeguridadObservacion_observacion${index + 1}`] = obs[2] || '';
        fieldMappings[`SeguridadObservacion_bueno${index + 1}`] = obs[0] === '1';
        fieldMappings[`SeguridadObservacion_n${index + 1}`] = obs[1] === '1';
      });

    }


    // Depuración: imprimir los valores de los campos checkbox
    console.log("Field Mappings:", fieldMappings);

    return fieldMappings;
  }
  async setFieldValue(form: any, fieldName: string, value: string | boolean, pdfDoc: PDFDocument) {
    if (fieldName.startsWith('caja') && value === '') {
      // No mostrar los campos de equipos sin borde (valor vacío)
      return;
    }
    const field = form.getField(fieldName);
    if (field instanceof PDFTextField) {
      field.setText(value as string);
      if (fieldName.startsWith('ingresado_') || fieldName.startsWith('caja')) {
        await this.addBorderToField(pdfDoc, field);
      }
    } else if (field instanceof PDFCheckBox) {
      if (value === true) {
        field.check();
      } else {
        field.uncheck();
      }
    } else if (field instanceof PDFDropdown) { // Manejar campos de tipo PDFDropdown
      field.select(value as string);
      if (fieldName.startsWith('ingresado_') || fieldName.startsWith('caja')) {
        await this.addBorderToField(pdfDoc, field);
      }
    } else {
      console.error('El campo ${fieldName} no es ni PDFTextField ni PDFCheckBox ni PDFDropdown.');
    }
  }
  async addBorderToField(pdfDoc: PDFDocument, field: any) {
    const pages = pdfDoc.getPages();
    const page = pages[0];
    const widgets = field.acroField.getWidgets();
    widgets.forEach((widget:any) => {
      const rect = widget.getRectangle();
      page.drawRectangle({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });
    });
  }


  async fillPdf() {
    if (!this.pm1) {
      console.error('No pm1 data provided to fill the PDF.');
      return;
    }

    try {
      const pdfBytes = await this.http.get(this.pdfSrc, { responseType: 'arraybuffer' }).toPromise();

      if (!pdfBytes) {
        throw new Error('Failed to load PDF bytes');
      }

      const pdfDoc = await PDFDocument.load(pdfBytes as ArrayBuffer);
      const form = pdfDoc.getForm();

      // Mapeo de los datos de pm1 a los campos del formulario
      //const fieldMappings = this.createFieldMappings(this.pm1);

      // Mapeo de los datos de pm1 a los campos del formulario
      const fieldMappings = this.createFieldMappings(this.pm1);
      console.log('Field Mappings después de crear:', fieldMappings);
      // Iterar sobre la estructura de mapeo y completar los campos del formulario
      for (const [fieldName, fieldValue] of Object.entries(fieldMappings)) {
        try {
          await this.setFieldValue(form, fieldName, fieldValue, pdfDoc);
        } catch (e) {
          console.error(`Error estableciendo el valor para el campo ${fieldName}:`, e);
        }
      }
      // Manejar el campo firma_1 como una imagen
      if (this.pm1.firma_1) {
        try {
          const imageData = this.pm1.firma_1.split(',')[1];
          const imageBytes = Uint8Array.from(atob(imageData), c => c.charCodeAt(0));
          let image;
          if (this.pm1.firma_1.startsWith('data:image/png')) {
            image = await pdfDoc.embedPng(imageBytes);
          } else if (this.pm1.firma_1.startsWith('data:image/jpeg')) {
            image = await pdfDoc.embedJpg(imageBytes);
          } else {
            console.error('Formato de imagen no soportado. Solo PNG y JPEG son soportados.');
            return;
          }

          const page = pdfDoc.getPage(0);
          const { width, height } = page.getSize();
          const x = 130;
          const y = height - 760;
          const imgWidth = 35;
          const imgHeight = 30;

          page.drawImage(image, {
            x: x,
            y: y - imgHeight,
            width: imgWidth,
            height: imgHeight,
          });
        } catch (error) {
          console.error('Error al obtener y embeder la imagen:', error);
        }
      }

      const pdfBytesModified = await pdfDoc.save();
      console.log('PDF modificado guardado correctamente.');
      this.filledPdf = pdfBytesModified;
      this.loadPdf();
    } catch (error) {
      console.error('Error al rellenar el PDF:', error);
    }
  }

  loadPdf() {
    if (this.filledPdf && this.pdfViewerpm) {
      const canvas = this.pdfViewerpm.nativeElement;
      if (!canvas) {
        console.error('El canvas no está disponible.');
        return;
      }

      const loadingTask = pdfjsLib.getDocument({ data: this.filledPdf });
      loadingTask.promise
        .then(pdf => {
          pdf.getPage(1).then(page => {
            const viewport = page.getViewport({ scale: 1.5 });
            const context = canvas.getContext('2d');

            if (context) {
              canvas.height = viewport.height;
              canvas.width = viewport.width;

              const renderContext = { canvasContext: context, viewport: viewport };
              page.render(renderContext).promise.then(() => {
                console.log('PDF renderizado correctamente en el canvas.');
              }).catch(renderError => {
                console.error('Error al renderizar la página en el canvas:', renderError);
              });
            } else {
              console.error('El contexto del canvas es nulo.');
            }
          }).catch(pageError => {
            console.error('Error al obtener la página del PDF:', pageError);
          });
        })
        .catch(error => {
          console.error('Error cargando el PDF:', error);
        });
    } else {
      if (!this.filledPdf) {
        console.error('filledPdf es nulo o indefinido.');
      }
      if (!this.pdfViewerpm) {
        console.error('pdfViewerpm (canvas) no está disponible.');
      }
    }
  }


  loadPdfFromSrc() {
    console.log('Cargando PDF desde la fuente:', this.pdfSrc);

    // Obtener el PDF desde la URL usando HttpClient
    this.http.get(this.pdfSrc, { responseType: 'arraybuffer' }).subscribe(
      pdfBytes => {
        // Depuración: Mostrar datos del PDF cargado
        console.log('PDF cargado desde la fuente. Tamaño en bytes:', pdfBytes.byteLength);

        this.filledPdf = pdfBytes;
        this.loadPdf();
      },
      error => {
        // Depuración: Manejo de error al cargar el PDF
        console.error('Error al cargar el PDF desde la fuente:', error);
      }
    );
  }

}*/



export class PdfViewerPm1Component implements OnInit, AfterViewInit {
  pdfSrc: string;
  pm1: BuscarPM1PorId;
  filledPdf: string | ArrayBuffer | null = null;
  isRendering: boolean = false;
  @ViewChild('pdfViewerpm', { static: false }) pdfViewerpm!: ElementRef<HTMLCanvasElement>;

  constructor(
    @Inject(NZ_MODAL_DATA) public data: any,
    private modal: NzModalRef,
    private http: HttpClient,
  ) {
    this.pdfSrc = data.pdfSrc;
    this.pm1 = data.pm1 || null;
    console.log('Constructor - PDF Source:', this.pdfSrc);
    console.log('Constructor - PM1 Data:', this.pm1);
  }

  ngOnInit(): void {
    console.log('ngOnInit - PDF Source:', this.pdfSrc);
    console.log('ngOnInit - PM1 Data:', this.pm1);
    // Configuración del worker de pdf.js
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit - PDF Viewer Element:', this.pdfViewerpm?.nativeElement);

    // Controlar que no se renderice más de una vez
    if (this.isRendering) {
      console.warn('Ya se está renderizando el PDF.');
      return;
    }

    // Primero intentamos llenar el PDF si tenemos datos PM1
    if (this.pm1) {
      this.fillPdf();
    }
    // Si no hay datos PM1, pero hay una fuente PDF, solo cargamos el PDF
    else if (this.pdfSrc) {
      this.loadPdfFromSrc();
    }
    // Si no hay datos ni fuente PDF, mostramos error
    else {
      console.error('No PDF source or PM1 data found.');
    }
  }


  loadPdfFromSrc() {
    this.http.get(this.pdfSrc, { responseType: 'arraybuffer' }).subscribe(
      (pdfBytes) => {
        this.filledPdf = pdfBytes;
        this.loadPdf();
      },
      (error) => {
        console.error('Error al cargar el PDF desde la fuente:', error);
      }
    );
  }

  async fillPdf() {
    if (!this.pm1) {
      console.error('No pm1 data provided to fill the PDF.');
      return;
    }

    try {
      const pdfBytes = await this.http.get(this.pdfSrc, { responseType: 'arraybuffer' }).toPromise();

      if (!pdfBytes) {
        throw new Error('Failed to load PDF bytes');
      }

      const pdfDoc = await PDFDocument.load(pdfBytes as ArrayBuffer);
      const form = pdfDoc.getForm();

      // Mapeo de los datos de pm1 a los campos del formulario
      //const fieldMappings = this.createFieldMappings(this.pm1);

      // Mapeo de los datos de pm1 a los campos del formulario
      const fieldMappings = this.createFieldMappings(this.pm1);
      console.log('Field Mappings después de crear:', fieldMappings);
      // Iterar sobre la estructura de mapeo y completar los campos del formulario
      for (const [fieldName, fieldValue] of Object.entries(fieldMappings)) {
        try {
          // Ensure fieldValue is converted to a string
          const value = typeof fieldValue === 'boolean' ? (fieldValue ? 'Yes' : 'No') : String(fieldValue);
          await this.setFieldValue(form, fieldName, value, pdfDoc);
        } catch (e) {
          console.error(`Error estableciendo el valor para el campo ${fieldName}:`, e);
        }
      }

      // Manejar el campo firma_1 como una imagen
      if (this.pm1.firma_1) {
        try {
          const imageData = this.pm1.firma_1.split(',')[1];
          const imageBytes = Uint8Array.from(atob(imageData), c => c.charCodeAt(0));
          let image;
          if (this.pm1.firma_1.startsWith('data:image/png')) {
            image = await pdfDoc.embedPng(imageBytes);
          } else if (this.pm1.firma_1.startsWith('data:image/jpeg')) {
            image = await pdfDoc.embedJpg(imageBytes);
          } else {
            console.error('Formato de imagen no soportado. Solo PNG y JPEG son soportados.');
            return;
          }

          const page = pdfDoc.getPage(0);
          const { width, height } = page.getSize();
          const x = 120;
          const y = height - 760;
          const imgWidth = 35;
          const imgHeight = 30;

          page.drawImage(image, {
            x: x,
            y: y - imgHeight,
            width: imgWidth,
            height: imgHeight,
          });
        } catch (error) {
          console.error('Error al obtener y embeder la imagen:', error);
        }
      }

      if (this.pm1.firma_2) {
        try {
          const imageData = this.pm1.firma_2.split(',')[1];
          const imageBytes = Uint8Array.from(atob(imageData), c => c.charCodeAt(0));
          let image;
          if (this.pm1.firma_2.startsWith('data:image/png')) {
            image = await pdfDoc.embedPng(imageBytes);
          } else if (this.pm1.firma_2.startsWith('data:image/jpeg')) {
            image = await pdfDoc.embedJpg(imageBytes);
          } else {
            console.error('Formato de imagen no soportado. Solo PNG y JPEG son soportados.');
            return;
          }

          const page = pdfDoc.getPage(0);
          const { width, height } = page.getSize();
          const x = 340;
          const y = height - 760;
          const imgWidth = 35;
          const imgHeight = 30;

          page.drawImage(image, {
            x: x,
            y: y - imgHeight,
            width: imgWidth,
            height: imgHeight,
          });
        } catch (error) {
          console.error('Error al obtener y embeder la imagen:', error);
        }
      }

      const pdfBytesModified = await pdfDoc.save();
      console.log('PDF modificado guardado correctamente.');
      this.filledPdf = pdfBytesModified;
      this.loadPdf();
    } catch (error) {
      console.error('Error al rellenar el PDF:', error);
    }
  }

  async setFieldValue(form: any, fieldName: string, value: string | boolean, pdfDoc: PDFDocument) {
    try {
        const field = form.getField(fieldName);

        // Verifica el tipo de campo y agrega depuración
        if (field instanceof PDFTextField) {
            field.setText(String(value)); // Asegura que el valor sea una cadena
            field.setFontSize(8); // Ajusta el tamaño de la fuente si es necesario
            console.log(`Campo de texto establecido: ${fieldName} = ${value}`);
        } else if (field instanceof PDFCheckBox) {
            // Usa la variable 'value' en lugar de 'fieldValue'
            const isChecked = value === 'Yes' || value === true;

            if (isChecked) {
                field.check(); // Marca el checkbox
            } else {
                field.uncheck(); // Desmarca el checkbox
            }
            console.log(`Campo checkbox establecido: ${fieldName} = ${isChecked}`);
        } else if (field instanceof PDFDropdown) {
            field.select(String(value)); // Convierte el valor a cadena para desplegables
            console.log(`Campo desplegable establecido: ${fieldName} = ${value}`);
        } else {
            // Agrega depuración para los tipos de campo no soportados
            console.error(`Campo no soportado (solo se manejan campos de texto, checkbox y desplegable): ${fieldName}`);
            console.log(`Tipo de campo no soportado: ${field.constructor.name}`);
        }
    } catch (error) {
        console.error(`Error al establecer valor del campo ${fieldName}:`, error);
    }
}






  async loadPdf() {
    if (!this.filledPdf || !this.pdfViewerpm) {
      console.error('No se puede renderizar el PDF.');
      return;
    }

    if (this.isRendering) {
      console.warn('Ya se está renderizando el PDF.');
      return;
    }

    this.isRendering = true;

    try {
      const pdfData = new Uint8Array(this.filledPdf as ArrayBuffer);
      const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
      const pageNumber = 1; // Ajustar según la página que quieres mostrar
      const page = await pdf.getPage(pageNumber);

      const canvas = this.pdfViewerpm.nativeElement;
      const viewport = page.getViewport({ scale: 2.4 });
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('El contexto del canvas no está disponible.');
      }

      context.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);

      const renderContext = {
        canvasContext: context,
        viewport,
      };

      await page.render(renderContext).promise;
      console.log('PDF renderizado correctamente.');
    } catch (error) {
      console.error('Error al renderizar el PDF:', error);
    } finally {
      this.isRendering = false;
    }
  }

  createFieldMappings(pm1: any): { [key: string]: string | boolean } {
    const fieldMappings: { [key: string]: string | boolean } = {};

    // Asignar valores directos de pm1 a los campos del formulario
    fieldMappings['tag_subestacion'] = pm1.tag_subestacion || '';
    fieldMappings['ubicacion'] = pm1.ubicacion || '';
    fieldMappings['hora_inicio'] = pm1.hora_inicio || '';
    fieldMappings['hora_fin'] = pm1.hora_fin || '';
    fieldMappings['orden_trabajo'] = pm1.orden_trabajo || '';
    fieldMappings['correo_supervisor'] = pm1.correo_supervisor || '';
    fieldMappings['correo_tecnico'] = pm1.correo_tecnico || '';
    fieldMappings['corriente_actual'] = pm1.corriente_actual || '';
    fieldMappings['fecha'] = pm1.fecha || '';
    fieldMappings['fotocheck_supervisor'] = pm1.fotocheck_supervisor || '';
    fieldMappings['fotocheck_tecnico'] = pm1.fotocheck_tecnico || '';
    fieldMappings['potencia_actual'] = pm1.potencia_actual || '';
    fieldMappings['transformador'] = pm1.transformador || '';
    // Asignar valores de los equipos
    if (pm1.equipos) {
      // Separa los equipos y usa un tipo explícito
      const equipos: string[][] = pm1.equipos.split(',').map((e: string): string[] => e.split('|'));

      equipos.forEach((equipo: string[], index: number) => {
        // Usa un índice dinámico para cada caja y campo ingresado
        fieldMappings[`ingresado_${index + 1}`] = equipo[1] || '';
        fieldMappings[`caja${index + 1}`] = equipo[0] || '';

        // Verifica los campos de campo mapeados
        console.log(`Campo asignado: ingresado_${index + 1} = ${fieldMappings[`ingresado_${index + 1}`]}`);
        console.log(`Campo asignado: caja${index + 1} = ${fieldMappings[`caja${index + 1}`]}`);
      });
    }


    // Asignar valores de las observaciones de aviso
    if (pm1.aviso_observaciones) {
      const avisoObservaciones = pm1.aviso_observaciones.split(',').map((a: string) => a.split('|'));

      avisoObservaciones.forEach((obs: string[], index: number) => {
        fieldMappings[`ObservacionesAvisoSolicitud_observacion${index + 1}`] = obs[0] || '';
        fieldMappings[`ObservacionesAvisoSolicitud_si${index + 1}`] = obs[1] === '1';
        fieldMappings[`ObservacionesAvisoSolicitud_no${index + 1}`] = obs[2] === '1';
        fieldMappings[`ObservacionesAvisoSolicitud_solicitud${index + 1}`] = obs[3] || '';
      });
    }

    // Asignar valores de las observaciones del patio
    if (pm1.patio_observaciones) {
      const patioObservaciones = pm1.patio_observaciones.split(',').map((p: string) => p.split('|'));

      patioObservaciones.forEach((obs: string[], index: number) => {
        fieldMappings[`PatioEstadoObservaciones_observacion${index + 1}`] = obs[3] || '';
        fieldMappings[`PatioEstadoObservaciones_bueno${index + 1}`] = obs[0] === '1';
        fieldMappings[`PatioEstadoObservaciones_malo${index + 1}`] = obs[1] === '1';
        fieldMappings[`PatioEstadoObservaciones_na${index + 1}`] = obs[2] === '1';
      });
    }

    // Asignar valores de las observaciones de seguridad
    if (pm1.seguridad_observaciones) {
      const seguridadObservaciones = pm1.seguridad_observaciones.split(',').map((s: string) => s.split('|'));

      seguridadObservaciones.forEach((obs: string[], index: number) => {
        fieldMappings[`SeguridadObservacion_observacion${index + 1}`] = obs[2] || '';
        fieldMappings[`SeguridadObservacion_bueno${index + 1}`] = obs[0] === '1' ? true : false;
fieldMappings[`SeguridadObservacion_n${index + 1}`] = obs[1] === '1' ? true : false;


        console.log(`Mapeado checkbox bueno${index + 1}: ${obs[0] === '1'}`);
        console.log(`Mapeado checkbox n${index + 1}: ${obs[1] === '1'}`);
     });


    }


    // Depuración: imprimir los valores de los campos checkbox
    console.log("Field Mappings:", fieldMappings);

    return fieldMappings;
  }

}
