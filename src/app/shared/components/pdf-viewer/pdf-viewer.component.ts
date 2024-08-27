import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
//import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BuscarPM1PorId } from 'src/app/features/sistemas/interface/pm1';
import { PDFDocument, rgb, StandardFonts, PDFTextField, PDFCheckBox,PDFDropdown } from 'pdf-lib';
import { HttpClient } from '@angular/common/http';

import * as pdfjsLib from 'pdfjs-dist';
//import * as pdfjsViewer from 'pdfjs-dist/web/pdf_viewer';
@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [],
  templateUrl: './pdf-viewer.component.html',
  styleUrl: './pdf-viewer.component.css'
})
export class PdfViewerComponent {
  /*pdfSrc: string;
  pm1: BuscarPM1PorId;
  filledPdf: string | ArrayBuffer | null = null;

  @ViewChild('pdfViewer') pdfViewer: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PdfViewerDialogComponent>,
    private http: HttpClient
  ) {
    this.pdfSrc = data.pdfSrc;
    this.pm1 = data.pm1 || null;
  }

  ngOnInit(): void {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    if (this.pdfSrc) {
      this.loadPdfFromSrc();
    } else if (this.pm1) {
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
    const equipos = pm1.equipos.split(',').map(e => e.split('|'));

    equipos.forEach((equipo, index) => {
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
      const avisoObservaciones = pm1.aviso_observaciones.split(',').map(a => a.split('|'));
      avisoObservaciones.forEach((obs, index) => {
        fieldMappings[`ObservacionesAvisoSolicitud_observacion${index + 1}`] = obs[0] || '';
        fieldMappings[`ObservacionesAvisoSolicitud_si${index + 1}`] = obs[1] === '1';
        fieldMappings[`ObservacionesAvisoSolicitud_no${index + 1}`] = obs[2] === '1';
        fieldMappings[`ObservacionesAvisoSolicitud_solicitud${index + 1}`] = obs[3] || '';
      });
    }

    // Asignar valores de las observaciones del patio
    if (pm1.patio_observaciones) {
      const patioObservaciones = pm1.patio_observaciones.split(',').map(p => p.split('|'));
      patioObservaciones.forEach((obs, index) => {
        fieldMappings[`PatioEstadoObservaciones_observacion${index + 1}`] = obs[3] || '';
        fieldMappings[`PatioEstadoObservaciones_bueno${index + 1}`] = obs[0] === '1';
        fieldMappings[`PatioEstadoObservaciones_malo${index + 1}`] = obs[1] === '1';
        fieldMappings[`PatioEstadoObservaciones_na${index + 1}`] = obs[2] === '1';
      });
    }

    // Asignar valores de las observaciones de seguridad
    if (pm1.seguridad_observaciones) {
      const seguridadObservaciones = pm1.seguridad_observaciones.split(',').map(s => s.split('|'));
      seguridadObservaciones.forEach((obs, index) => {
        fieldMappings[`SeguridadObservacion_observacion${index + 1}`] = obs[2] || '';
        fieldMappings[`SeguridadObservacion_bueno${index + 1}`] = obs[0] === '1';
        fieldMappings[`SeguridadObservacion_n${index + 1}`] = obs[1] === '1';
      });
    }

    // Depuración: imprimir los valores de los campos checkbox
    console.log("Field Mappings:", fieldMappings);

    return fieldMappings;
  }

  async setFieldValue(form, fieldName, value, pdfDoc) {
    if (fieldName.startsWith('caja') && value === '') {
      // No mostrar los campos de equipos sin borde (valor vacío)
      return;
    }
    const field = form.getField(fieldName);
    if (field instanceof PDFTextField) {
      field.setText(value);
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
      field.select(value);
      if (fieldName.startsWith('ingresado_') || fieldName.startsWith('caja')) {
        await this.addBorderToField(pdfDoc, field);
      }
    } else {
      console.error(`El campo ${fieldName} no es ni PDFTextField ni PDFCheckBox ni PDFDropdown.`);
    }
  }

  async addBorderToField(pdfDoc, field) {
    const pages = pdfDoc.getPages();
    const page = pages[0];
    const widgets = field.acroField.getWidgets();
    widgets.forEach(widget => {
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
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const form = pdfDoc.getForm();

      // Mapeo de los datos de pm1 a los campos del formulario
      const fieldMappings = this.createFieldMappings(this.pm1);

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
      this.filledPdf = pdfBytesModified;
      this.loadPdf();
    } catch (error) {
      console.error('Error al rellenar el PDF:', error);
    }
  }

  loadPdf() {
    if (this.filledPdf) {
      const loadingTask = pdfjsLib.getDocument({ data: this.filledPdf });
      loadingTask.promise.then(pdf => {
        pdf.getPage(1).then(page => {
          const viewport = page.getViewport({ scale: 4 }); // Increase scale for better quality
          const canvas = this.pdfViewer.nativeElement;
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          page.render(renderContext);
        });
      }).catch(error => {
        console.error('Error loading PDF:', error);
      });
    }
  }

  loadPdfFromSrc() {
    this.http.get(this.pdfSrc, { responseType: 'arraybuffer' }).subscribe(
      pdfBytes => {
        this.filledPdf = pdfBytes;
        this.loadPdf();
      },
      error => {
        console.error('Error loading PDF from src:', error);
      }
    );
  }
*/
}
