import { Injectable } from '@angular/core';
import { Component, Inject, OnInit, ViewChild, ElementRef,Input,AfterViewInit } from '@angular/core';
import { BuscarPM1PorId,PM1 } from 'src/app/features/sistemas/interface/pm1';
import { PDFDocument, rgb, StandardFonts, PDFTextField, PDFCheckBox,PDFDropdown,PDFFont } from 'pdf-lib';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import * as pdfjsLib from 'pdfjs-dist';
import { PM1Service } from './pm1.service';
import { HttpRequest } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PdfPm1Service implements OnInit, AfterViewInit {

    pdfSrc: string = 'assets/pdf/pm1/pm1.pdf';
    pm1!: BuscarPM1PorId;
    filledPdf: string | ArrayBuffer | null = null;
    isRendering: boolean = false;
    @ViewChild('pdfViewerpm', { static: false }) pdfViewerpm!: ElementRef<HTMLCanvasElement>;


    constructor(
      private http: HttpClient,
      private PM1Service: PM1Service
    ) {

      this.pm1 = {} as BuscarPM1PorId; // Esto inicializa pm1 como un objeto vacío del tipo BuscarPM1PorId


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

      if (this.pdfSrc) {
        this.loadPdfFromSrc();
      } else {
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

    async fillPdf(id: number) {
      try {
        // Obtener datos antes de rellenar PDF
        const pm1Data = await this.PM1Service.getPM1ById(id).toPromise();

        // Asegurarse de que pm1Data no es undefined
        if (!pm1Data) {
          console.error('No se encontraron datos PM1.');
          return;
        }

        this.pm1 = pm1Data;
        const pdfBytes = await this.http.get(this.pdfSrc, { responseType: 'arraybuffer' }).toPromise();

        if (pdfBytes && new TextDecoder().decode(pdfBytes.slice(0, 4)) !== '%PDF') {
          throw new Error('El archivo no parece ser un PDF válido.');
      }

        if (!pdfBytes) {
          throw new Error('Failed to load PDF bytes');
        }

        const pdfDoc = await PDFDocument.load(pdfBytes as ArrayBuffer);
        const form = pdfDoc.getForm();
        const fieldMappings = this.createFieldMappings(this.pm1);

        console.log('Field Mappings después de crear:', fieldMappings);

        // Iterar sobre la estructura de mapeo y completar los campos del formulario
        for (const [fieldName, fieldValue] of Object.entries(fieldMappings)) {
          try {
            // Asegurar que fieldValue es un string antes de llamar a toLowerCase
            const value = typeof fieldValue === 'boolean' ? (fieldValue ? 'Yes' : 'No') : String(fieldValue || '');
            await this.setFieldValue(form, fieldName, value, pdfDoc);
          } catch (e) {
            console.error(`Error estableciendo el valor para el campo ${fieldName}:`, e);
          }
        }

        // Manejar el campo firma_1 como una imagen, comprobando si existe
        if (this.pm1.firma_1) {
          try {
            const imageData = this.pm1.firma_1.split(',')[1];
            if (imageData) {
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
            } else {
              console.error('Los datos de la imagen firma_1 están incompletos.');
            }
          } catch (error) {
            console.error('Error al obtener y embeder la imagen:', error);
          }
        }

        // Repetir la lógica de firma para firma_2
        if (this.pm1.firma_2) {
          try {
            const imageData = this.pm1.firma_2.split(',')[1];
            if (imageData) {
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
            } else {
              console.error('Los datos de la imagen firma_2 están incompletos.');
            }
          } catch (error) {
            console.error('Error al obtener y embeder la imagen:', error);
          }
        }

        // Guardar el PDF modificado en un Blob
        const pdfBytesModified = await pdfDoc.save();
        const modifiedPdfBlob = new Blob([pdfBytesModified], { type: 'application/pdf' });
        console.log('PDF modificado generado correctamente.');

        // Crear una URL temporal y abrir el PDF en una nueva pestaña
        const blobUrl = URL.createObjectURL(modifiedPdfBlob);
        window.open(blobUrl, '_blank');

        return modifiedPdfBlob;
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

        // Ancho deseado del contenedor (puedes ajustarlo según tus necesidades)
        const containerWidth = 1000;

        // Calcula el factor de escala basado en el ancho del contenedor y el ancho de la página
        const originalViewport = page.getViewport({ scale: 1 });
        const scaleFactor = containerWidth / originalViewport.width;
        const viewport = page.getViewport({ scale: scaleFactor });

        const canvas = this.pdfViewerpm.nativeElement;
        const context = canvas.getContext('2d');

        if (!context) {
            throw new Error('El contexto del canvas no está disponible.');
        }

        // Ajusta las dimensiones del canvas según el nuevo viewport escalado
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        // Limpia el canvas antes de renderizar la nueva página
        context.clearRect(0, 0, canvas.width, canvas.height);

        const renderContext = {
            canvasContext: context,
            viewport: viewport,
        };

        // Renderiza la página con el nuevo factor de escala
        await page.render(renderContext).promise;
        console.log('PDF renderizado correctamente con escalado.');
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
