import { Injectable } from '@angular/core';
import { Component, Inject, OnInit, ViewChild, ElementRef,Input,AfterViewInit } from '@angular/core';
import { BuscarPM1PorId,PM1 } from 'src/app/features/sistemas/interface/pm1';
import { PDFDocument, rgb, StandardFonts, PDFTextField, PDFCheckBox,PDFDropdown,PDFFont,PDFPage } from 'pdf-lib';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import * as pdfjsLib from 'pdfjs-dist';
import { PM1Service } from './pm1.service';
import { HttpRequest } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PdfPm1Service implements OnInit, AfterViewInit {



    constructor(
      private http: HttpClient,
      private PM1Service: PM1Service
    ) {

      this.pm1 = {} as BuscarPM1PorId; // Esto inicializa pm1 como un objeto vacío del tipo BuscarPM1PorId


      console.log('Constructor - PDF Source:', this.pdfSrc);
      console.log('Constructor - PM1 Data:', this.pm1);
    }


    pdfSrc: string = 'assets/pdf/pm1/pm1.pdf';
    pm1!: BuscarPM1PorId;
    filledPdf: string | ArrayBuffer | null = null;
    isRendering: boolean = false;
    @ViewChild('pdfViewerpm', { static: false }) pdfViewerpm!: ElementRef<HTMLCanvasElement>;
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

    async fillPdf(id: number): Promise<Blob | undefined> {
      try {
        const pm1Data = await this.PM1Service.getPM1ById(id).toPromise();

        if (!pm1Data) {
          console.error('No se encontraron datos PM1.');
          return undefined;
        }

        this.pm1 = pm1Data;

        const pdfBytes = await this.http.get(this.pdfSrc, { responseType: 'arraybuffer' }).toPromise();
        const pdfDoc = await PDFDocument.load(pdfBytes as ArrayBuffer);

        const fieldMappings = this.createFieldMappings(this.pm1);
        const page = pdfDoc.getPages()[0];


         // Cargar la imagen del checkmark
    const checkImageBytes = Uint8Array.from(atob(
      'iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAQmSURBVGhD7ZpJKH1RGMDve2QKGYuFEqUMiRAroUQ2hg0bGTLtZGOplCVZSSyIFEWKMmaj2KGkZCNDLIwb8/j973f63vPOO/dNf+8O79//V1/efee7dX73nHPP8JhARvoHMNNfn8dnRTY3N6WpqSm6ksGu5Uvc3t5CY2MjmEwmiIyMhJubG/a9T4ksLi5CXFwcjmkWOTk5cHp6ysp8QuTh4QFaWlpYK6CA2WyGzs5O+Pj4oAwfENnf34eUlBRrK4SFhcHs7CyV/mBokbGxMQgKCrJKJCcnw+HhIZXyGFLk9fUV2tvbrQIYhYWFcH9/TxkihhO5vr5mlbaVqK+vh7e3N8pQxlAiR0dHkJSUZBXAwd3d3Q3f39+U4RjDiGxtbbF5wSKBb6aBgQEqdY0hRJaXlyEkJMQq4efnB8PDw1TqHrqLzMzMgL+/PycxOjpKpe6jq8jExIR1ksPA7uRpS1jQTcReAj8PDg5SqefoIjI9Pc1JYPT09FDp36G5CC78bMcEBq6j3HnFOkNTEXkPwS05MCoqKuDz85My/h7NRA4ODiA8PJyTyM7OhsfHR8r4HZqIXFxcQEJCAicRHx8P5+fnlPF7VBfBJ44bIFsJ7F7b29uU4R1UFfn6+oKamhpOAt9WIyMjlOE9VBXp7e3lJDAaGhqo1LuoJrK0tCTMFRkZGfD8/EwZ3kUVkePjY4iIiOAkQkNDHe7uvIHXRV5eXiA3N5eTwFBjXNjCiby/v7ONfVNTE9TW1rLPns64XV1dgkRVVdWvZ25XWEX29vYgMzNTqERHRwd7+7jDysoKW8Ha3h8bGwtXV1eUoR5MZH5+HgIDA7kK2EZfXx9Ldgae+NkenllC6ehGDZgIdqmFhQVITEwUKoKBi7ydnR12gxLYberq6oT7qqurKUN9uDGCJxjp6elChTDy8vIcdjFsUft8XFddXl5ShvpwIsjJyYnw6rQE7iPswbMmXDfZ5/b391OGNggiyOTkpFAxjNTUVGHJ3dbWJuSlpaVx57JaoCiCXaigoECoIMbc3BxlAVv42b+lcDZfW1ujDO1QFEFwE2RbQUvk5+ezwY1PPCsrSygvLS1Vfc5QwqEIUlxcLFQUnzi2BJ522JfhUc7u7i7drS1ORdbX14XKYhQVFUFMTIzwfWVlJd2pPU5FsIsodR+lwLGiV2sgTkWQ8fFxxYrbR3l5Od2hDy5FcP8QHR2tWHlL4LjZ2NigO/TB5c/TwcHBUnNzM10pI88vUklJCV3pg1u/s7e2tkryGKArEXlSlORWoSudoJZxCg56+Ykrdis8Ebm7u6NM/XCrRfBpy/sSuvpBXhhKQ0NDUlRUFH2jIyTkkqenJ24xWVZWBmdnZ1SqP26LIPKgh4CAAPaTmB7LEGd49G9Oq6urkryTlOSlC31jHP7/v5axkKQ/E5O9NqOelV4AAAAASUVORK5CYII='
    ), c => c.charCodeAt(0));
    const checkImage = await pdfDoc.embedPng(checkImageBytes);


      // Renderizar valores e imágenes en los campos
    for (const [fieldName, fieldData] of Object.entries(fieldMappings)) {
      const { value, x, y } = fieldData as any;

      if (typeof value === 'boolean' && value === true) {
        page.drawImage(checkImage, {
          x,
          y,
          width: 6,
          height: 6,
        });
      } else if (typeof value === 'string') {
        page.drawText(value, {
          x,
          y,
          size: 6,
          font: await pdfDoc.embedFont(StandardFonts.Helvetica),
          color: rgb(0, 0, 0),
        });
      }
    }
        // Firma 1
    if (this.pm1.firma_1) {
      const imageBytes = this.getImageBytes(this.pm1.firma_1);
      if (imageBytes) {
        const image = await this.embedImage(pdfDoc, this.pm1.firma_1, imageBytes);
        const firmaCoordinates = { x: 120, y: 5, width: 35, height: 20 };
        this.addImageToPage(page, image, firmaCoordinates);
      }
    }

    // Firma 2
    /*if (this.pm1.firma_2) {
      const imageBytes = this.getImageBytes(this.pm1.firma_2);
      if (imageBytes) {
        const image = await this.embedImage(pdfDoc, this.pm1.firma_2, imageBytes);
        const firmaCoordinates = { x: 340, y: 80, width: 35, height: 30 };
        this.addImageToPage(page, image, firmaCoordinates);
      }
    }*/


      // Asignar valores manuales para equipos con coordenadas dinámicas
    // Comprueba si hay algún equipo disponible
    if (this.pm1.equipo_item1 || this.pm1.equipo_item2 || this.pm1.equipo_item3 || this.pm1.equipo_item4) {
      // Función auxiliar para cargar y parsear equipos
      const parseEquipo = (item: string | undefined | null) => (item ? JSON.parse(item) : null);


      // Lista de equipos válidos
      const equipos: { valor_real?: string[]; valor_testigo?: string[]; seleccionado?: string[] }[] = [
        parseEquipo(this.pm1.equipo_item1),
        parseEquipo(this.pm1.equipo_item2),
        parseEquipo(this.pm1.equipo_item3),
        parseEquipo(this.pm1.equipo_item4),
      ].filter(equipo => equipo !== null);

      // Coordenadas predefinidas para cada ítem
      const coordenadasManual = {
        item1: [{ x: 100, y: 600 }, { x: 100, y: 570 }, { x: 100, y: 540 }],
        item2: [{ x: 500, y: 600 }, { x: 500, y: 570 }, { x: 500, y: 540 }],
        item3: [{ x: 100, y: 350 }, { x: 100, y: 320 }, { x: 100, y: 290 }],
        item4: [{ x: 500, y: 500 }, { x: 500, y: 470 }, { x: 500, y: 440 }],
      };

      // Espaciados ajustables
      const ESPACIADO_HORIZONTAL = 60;
      const ESPACIADO_VERTICAL = 30;

      // Recorre cada equipo y dibuja los valores en el PDF
      equipos.forEach((equipo, index) => {
        const itemKey = `item${index + 1}` as 'item1' | 'item2' | 'item3' | 'item4';
        const coordenadas = coordenadasManual[itemKey];

        const maxLength = Math.max(
          equipo.valor_real?.length || 0,
          equipo.valor_testigo?.length || 0,
          equipo.seleccionado?.length || 0
        );

        for (let i = 0; i < maxLength; i++) {
          const coord = coordenadas?.[i] || { x: 0, y: 0 };

          // Dibujar rectángulo para "valor_real"
          if (equipo.valor_real?.[i] !== undefined) {
            drawRectangleAndText({
              x: coord.x,
              y: coord.y,
              width: 20,
              height: 20,
              borderColor: 'black',
              text: equipo.valor_real[i],
              label: 'v. real',
              unit: null,
              page,
              pdfDoc,
              fontSize: 6,
            });
          }

          // Dibujar rectángulo para "valor_testigo"
          if (equipo.valor_testigo?.[i] !== undefined) {
            drawRectangleAndText({
              x: coord.x + ESPACIADO_HORIZONTAL,
              y: coord.y,
              width: 20,
              height: 20,
              borderColor: 'black',
              text: equipo.valor_testigo[i],
              label: 'v. testigo',
              unit: '°C',
              page,
              pdfDoc,
              fontSize: 6,
            });
          }

          // Dibujar rectángulo para "seleccionado"
          if (equipo.seleccionado?.[i] !== undefined) {
            drawRectangleAndText({
              x: coord.x,
              y: coord.y - ESPACIADO_VERTICAL,
              width: 40,
              height: 20,
              borderColor: 'black',
              text: equipo.seleccionado[i],
              label: null,
              unit: null,
              page,
              pdfDoc,
              fontSize: 5,
            });
          }
        }
      });

      // Función para dibujar rectángulo con texto y etiquetas
      async function drawRectangleAndText({
        x,
        y,
        width,
        height,
        borderColor,
        text,
        label,
        unit,
        page,
        pdfDoc,
        fontSize,
      }: {
        x: number;
        y: number;
        width: number;
        height: number;
        borderColor: string;
        text: string;
        label?: string | null;
        unit?: string | null;
        page: any;
        pdfDoc: any;
        fontSize: number;
      }) {
        const color = rgb(0, 0, 0);

        // Dibujar rectángulo
        page.drawRectangle({
          x,
          y,
          width,
          height,
          borderColor: color,
          borderWidth: 1,
        });

        // Añadir el texto
        page.drawText(String(text), {
          x: x + 3,
          y: y + height / 2 - fontSize / 2,
          size: fontSize,
          font: await pdfDoc.embedFont(StandardFonts.Helvetica),
          color,
        });

        // Añadir etiqueta debajo del rectángulo si existe
        if (label) {
          page.drawText(label, {
            x,
            y: y - 12,
            size: fontSize,
            font: await pdfDoc.embedFont(StandardFonts.Helvetica),
            color,
          });
        }

        // Añadir unidad si existe
        if (unit) {
          page.drawText(unit, {
            x: x + width + 3,
            y: y + height / 2 - fontSize / 2,
            size: fontSize,
            font: await pdfDoc.embedFont(StandardFonts.Helvetica),
            color,
          });
        }
      }
    }



        const pdfBytesModified = await pdfDoc.save();
        const modifiedPdfBlob = new Blob([pdfBytesModified], { type: 'application/pdf' });

        return modifiedPdfBlob; // Retorna el Blob generado
      } catch (error) {
        console.error('Error al rellenar el PDF:', error);
        return undefined;
      }
    }


    private getImageBytes(imageData: string): Uint8Array | null {
      try {
        const data = imageData.split(',')[1];
        return Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
      } catch {
        console.error('Error al procesar los datos de la imagen.');
        return null;
      }
    }

    private async embedImage(pdfDoc: PDFDocument, imageData: string, imageBytes: Uint8Array) {
      if (imageData.startsWith('data:image/png')) {
        return pdfDoc.embedPng(imageBytes);
      } else if (imageData.startsWith('data:image/jpeg')) {
        return pdfDoc.embedJpg(imageBytes);
      } else {
        console.error('Formato de imagen no soportado. Solo PNG y JPEG son soportados.');
        throw new Error('Formato de imagen no soportado');
      }
    }

    private addImageToPage(page: PDFPage, image: any, coordinates: { x: number; y: number; width: number; height: number }) {
      const { x, y, width, height } = coordinates;
      page.drawImage(image, { x, y, width, height });
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
createFieldMappings(pm1: any): { [key: string]: { value: string | boolean; x: number; y: number } } {
  const fieldMappings: { [key: string]: { value: string | boolean; x: number; y: number } } = {};

  // Asignar valores directos con coordenadas (ejemplo: 'tag_subestacion')
  fieldMappings['tag_subestacion'] = { value: pm1.tag_subestacion || '', x: 190, y: 725 };
  fieldMappings['ubicacion'] = { value: pm1.ubicacion || '', x: 320, y: 732 };
  fieldMappings['hora_inicio'] = { value: pm1.hora_inicio || '', x: 310, y: 722 };
  fieldMappings['hora_fin'] = { value: pm1.hora_fin || '', x: 400, y: 722 };
  fieldMappings['orden_trabajo'] = { value: pm1.orden_trabajo || '', x:490, y: 732 };
  fieldMappings['fecha'] = { value: pm1.fecha || '', x: 490, y: 722 };

  fieldMappings['fotocheck_tecnico'] = { value: pm1.fotocheck_tecnico || '', x: 130, y: 29 };
  fieldMappings['correo_tecnico'] = { value: pm1.correo_tecnico || '', x: 130, y: 37 };
  fieldMappings['fotocheck_supervisor'] = { value: pm1.fotocheck_supervisor || '', x: 350, y: 29 };
  fieldMappings['correo_supervisor'] = { value: pm1.correo_supervisor || '', x: 350, y: 37 };


  fieldMappings['corriente_actual'] = { value: pm1.corriente_actual || '', x: 460, y: 620 };
  fieldMappings['potencia_actual'] = { value: pm1.potencia_actual || '', x: 450, y: 635 };
  fieldMappings['transformador'] = { value: pm1.transformador || '', x: 170, y: 635 };










   // Aviso Observaciones
   if (pm1.aviso_observaciones) {
    const avisoObservaciones = pm1.aviso_observaciones.split(',').map((a: string) => a.split('|'));
    avisoObservaciones.forEach((obs: string[], index: number) => {
      const baseY = 95 - index * 10.5; // Coordenada Y dinámica
      fieldMappings[`ObservacionesAvisoSolicitud_observacion${index + 1}`] = { value: obs[0] || '', x: 80, y: baseY };
      fieldMappings[`ObservacionesAvisoSolicitud_si${index + 1}`] = { value: obs[1] === '1', x: 450, y: baseY };
      fieldMappings[`ObservacionesAvisoSolicitud_no${index + 1}`] = { value: obs[2] === '1', x: 480, y: baseY };
      fieldMappings[`ObservacionesAvisoSolicitud_solicitud${index + 1}`] = { value: obs[3] || '', x: 498, y: baseY };
    });
  }

  // Patio Observaciones
  if (pm1.patio_observaciones) {
    const patioObservaciones = pm1.patio_observaciones.split(',').map((p: string) => p.split('|'));
    patioObservaciones.forEach((obs: string[], index: number) => {
      const baseY = 155 - index * 11.5; // Coordenada Y dinámica

      fieldMappings[`PatioEstadoObservaciones_bueno${index + 1}`] = { value: obs[0] === '1', x: 280, y: baseY };
      fieldMappings[`PatioEstadoObservaciones_malo${index + 1}`] = { value: obs[1] === '1', x: 330, y: baseY };
      fieldMappings[`PatioEstadoObservaciones_na${index + 1}`] = { value: obs[2] === '1', x: 360, y: baseY };
      fieldMappings[`PatioEstadoObservaciones_observacion${index + 1}`] = { value: obs[3] || '', x: 395, y: baseY };
    });
  }

  // Seguridad Observaciones
  if (pm1.seguridad_observaciones) {
    const seguridadObservaciones = pm1.seguridad_observaciones.split(',').map((s: string) => s.split('|'));
    seguridadObservaciones.forEach((obs: string[], index: number) => {
      const baseY = 695 - index * 9; // Coordenada Y dinámica
      fieldMappings[`SeguridadObservacion_bueno${index + 1}`] = { value: obs[0] === '1', x: 353, y: baseY };
      fieldMappings[`SeguridadObservacion_n${index + 1}`] = { value: obs[1] === '1', x: 450, y: baseY };
      fieldMappings[`SeguridadObservacion_observacion${index + 1}`] = { value: obs[2] || '', x:390, y: baseY };

    });
  }


  // Depuración de asignaciones
  console.log('Field Mappings con coordenadas:', fieldMappings);

  return fieldMappings;
}

}
