import { Injectable } from '@angular/core';
import { Component, Inject, OnInit, ViewChild, ElementRef,Input,AfterViewInit } from '@angular/core';
import { BuscarPM1PorId,PM1 } from 'src/app/features/sistemas/interface/pm1';
import { PDFDocument, rgb, StandardFonts, PDFTextField, PDFCheckBox,PDFDropdown,PDFFont,PDFPage } from 'pdf-lib';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import * as pdfjsLib from 'pdfjs-dist';
import { PM1Service } from './pm1.service';
import { HttpRequest } from '@angular/common/http';
import { TransformadorPM1Service } from './transformador-pm1.service';
@Injectable({
  providedIn: 'root'
})
export class PdfPm1Service implements OnInit {
  pm1!: BuscarPM1PorId;
  filledPdf: string | ArrayBuffer | null = null;
  isRendering: boolean = false;
  // Cache para los datos PM1 (usado durante el llenado de PDF)
  pm1DataCache: BuscarPM1PorId | null = null;

  @ViewChild('pdfViewerpm', { static: false })
  pdfViewerpm!: ElementRef<HTMLCanvasElement>;
  

  constructor(private http: HttpClient, private PM1Service: PM1Service) {
    this.pm1 = {} as BuscarPM1PorId;
  }

  ngOnInit(): void {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  // 🔹 Paso 1: Obtener datos PM1 y PDF plantilla local
  async fillpdf(id: number): Promise<Blob | null> {
    try {
      // 1️⃣ Obtener datos PM1
      const pm1Data = await this.PM1Service.getPM1ById(id).toPromise();
      if (!pm1Data) {
        console.error('No se pudieron obtener los datos de PM1.');
        return null;
      }

      this.pm1 = pm1Data;
      console.log('Datos PM1 obtenidos:', pm1Data);

      // 2️⃣ Obtener el PDF desde assets
      const pdfBytes = await this.http
        .get('assets/plantilla.pdf', { responseType: 'arraybuffer' })
        .toPromise();

      if (!pdfBytes) {
        console.error('No se encontró el PDF en assets.');
        return null;
      }

      // 3️⃣ Cargar PDF y rellenar formulario
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const form = pdfDoc.getForm();

      // Muestra los nombres de los campos en consola (para debug)
      form.getFields().forEach(f => console.log('Campo PDF:', f.getName()));

      // 4️⃣ Rellenar campos
      try {
        // Embed a font and update appearances so the text is visible in the saved PDF
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // Use the actual field names discovered in the PDF (logged earlier)
        // and map them to the PM1 data properties.
        const safe = (v: any) => (v === null || v === undefined) ? '' : String(v);

        // Map of PDF field name => value to set
        const fieldMap: Record<string, string> = {
          subestacion: safe(pm1Data.tag_subestacion),
          transformador: safe(pm1Data.transformador),
          ubicacion: safe(pm1Data.ubicacion),
          orden_trabajo: safe(pm1Data.orden_trabajo),
          hora_inicio: safe(pm1Data.hora_inicio),
          hora_fin: safe(pm1Data.hora_fin),
          fecha : safe(pm1Data.fecha),
          potencia_actual: safe(pm1Data.potencia_actual),
          corriente_actual: safe(pm1Data.corriente_actual),



          
          tecnico: safe(pm1Data.correo_tecnico),
          supervisor: safe(pm1Data.correo_supervisor),
          fotocheck_tecnico: safe(pm1Data.fotocheck_tecnico),
          fotocheck_supervisor: safe(pm1Data.fotocheck_supervisor),
        };

        // Iterate fields and set text where mapping exists. Also set font and font size so text appears.
        const fields = form.getFields();
        for (const field of fields) {
          const name = field.getName();
          if (Object.prototype.hasOwnProperty.call(fieldMap, name)) {
            try {
              const value = fieldMap[name] || '';
              // Try to treat it as a TextField and set font/size
              try {
                const textField = form.getTextField(name) as any;
                if (textField) {
                  if (typeof textField.setFont === 'function') textField.setFont(helveticaFont);
                  if (typeof textField.setFontSize === 'function') textField.setFontSize(10);
                  textField.setText(value);
                }
              } catch (inner) {
                // fallback: try generic setText if available on field
                try {
                  (field as any).setText(value);
                } catch (inner2) {
                  // ignore if field type doesn't support setText
                }
              }
            } catch (e) {
              // ignore single-field failures
            }
          }
        }
    


          //patio 
          try {
  if (pm1Data.patio_observaciones && typeof pm1Data.patio_observaciones === 'string') {
    const rows = pm1Data.patio_observaciones.split(',').map(r => r.split('|'));

    for (let i = 0; i < rows.length && i < 4; i++) {
      const [texto, estado, indice] = rows[i].map(c => (c || '').trim());

      const buenoName = `bueno_${5 + i}`;          // bueno_5 .. bueno_8
      const maloName = `malo_${1 + i}`;            // malo_1 .. malo_4
      const naName = `na_${5 + i}`;                // na_5 .. na_8
      const obsName = `observacion_${4 + i}`;      // observacion_4 .. observacion_8

      // --- Limpiar checkboxes previos ---
      const clearCheck = (name: string) => {
        try {
          const cb = form.getCheckBox(name);
          if (cb) (cb as any).uncheck();
        } catch {}
      };
      [buenoName, maloName, naName].forEach(clearCheck);

      // --- Marcar checkbox según estado ---
      try {
        if (estado.toUpperCase() === 'BUENO') {
          const cbBueno = form.getCheckBox(buenoName);
          if (cbBueno) (cbBueno as any).check();
        } else if (estado.toUpperCase() === 'MALO') {
          const cbMalo = form.getCheckBox(maloName);
          if (cbMalo) (cbMalo as any).check();
        } else if (estado.toUpperCase() === 'NA') {
          const cbNa = form.getCheckBox(naName);
          if (cbNa) (cbNa as any).check();
        }
      } catch (e) {
        console.warn('Error marcando checkbox patio:', e);
      }

      // --- Escribir observación ---
      try {
        const obsField = form.getTextField(obsName) as any;
        if (obsField) {
          if (typeof obsField.setFont === 'function') obsField.setFont(helveticaFont);
          if (typeof obsField.setFontSize === 'function') obsField.setFontSize(9);
          obsField.setText(texto || '');
        }
      } catch (e) {
        console.warn('Error escribiendo observación patio:', e);
      }
    }
  }
} catch (procErr) {
  console.warn('Error procesando patio_observaciones:', procErr);
}

        // --- Nuevo: procesar aviso_observaciones (ej. "1|1|0|1,2|1|0|2,3|0|1|3,4|0|1|4,5|1|0|5") ---
        try {
  if (pm1Data.aviso_observaciones && typeof pm1Data.aviso_observaciones === 'string') {
    const rows = pm1Data.aviso_observaciones.split(',').map(r => r.split('|'));

    for (let i = 0; i < rows.length && i < 5; i++) {
      const [texto, estado, indice] = rows[i].map(c => (c || '').trim());

      const maloName = `malo_${5 + i}`;            // malo_5 .. malo_9
      const naName = `na_${9 + i}`;                // na_9 .. na_13
      const obsName = `observacion_${9 + i}`;      // observacion_9 .. observacion_13

      // --- Limpiar checkboxes previos ---
      const clearCheck = (name: string) => {
        try {
          const cb = form.getCheckBox(name);
          if (cb) (cb as any).uncheck();
        } catch {}
      };
      [maloName, naName].forEach(clearCheck);

      // --- Marcar checkbox según estado ---
      try {
        if (estado.toUpperCase() === 'MALO') {
          const cbMalo = form.getCheckBox(maloName);
          if (cbMalo) (cbMalo as any).check();
        } else if (estado.toUpperCase() === 'NA') {
          const cbNa = form.getCheckBox(naName);
          if (cbNa) (cbNa as any).check();
        }
      } catch (e) {
        console.warn('Error marcando checkbox aviso:', e);
      }

      // --- Escribir observación ---
      try {
        const obsField = form.getTextField(obsName) as any;
        if (obsField) {
          if (typeof obsField.setFont === 'function') obsField.setFont(helveticaFont);
          if (typeof obsField.setFontSize === 'function') obsField.setFontSize(9);
          obsField.setText(texto || '');
        }
      } catch (e) {
        console.warn('Error escribiendo observación aviso:', e);
      }
    }
  }
} catch (procErr) {
  console.warn('Error procesando aviso_observaciones:', procErr);
}



        // ...existing code...
        // Update appearances so saved PDF shows the text
        try {
          (form as any).updateFieldAppearances(helveticaFont);
        } catch (updateErr) {
          console.warn('No se pudo actualizar apariencias de campos (opcional):', updateErr);
        }

        // ...existing code...
        // --- Nuevo: procesar seguridad_observaciones (ej. "1|0|1,1|0|2,0|1|3,0|1|4") ---
        try {
          if (pm1Data.seguridad_observaciones && typeof pm1Data.seguridad_observaciones === 'string') {
            const rows = pm1Data.seguridad_observaciones.split(',').map(r => r.split('|'));
            for (let i = 0; i < rows.length; i++) {
              const cols = rows[i];
              if (!cols || cols.length < 3) continue;

              const [buenoRaw, naRaw, obsRaw] = cols.map(c => (c === undefined ? '' : String(c)));

              const buenoName = `bueno_${1 + i}`;        // bueno_1 .. bueno_4
              const naName = `na_${1 + i}`;              // na_1 .. na_4
              const obsName = `observacion_${1 + i}`;    // observacion_1 .. observacion_4

              // marcar checkbox "bueno"
              try {
                const cbBueno = form.getCheckBox(buenoName);
                if (cbBueno) {
                  if (buenoRaw === '1') (cbBueno as any).check();
                  else (cbBueno as any).uncheck();
                }
              } catch (e) {}

              // marcar checkbox "na"
              try {
                const cbNa = form.getCheckBox(naName);
                if (cbNa) {
                  if (naRaw === '1') (cbNa as any).check();
                  else (cbNa as any).uncheck();
                }
              } catch (e) {}

              // setear observación (texto)
              try {
                const obsField = form.getTextField(obsName) as any;
                if (obsField) {
                  if (typeof obsField.setFont === 'function') obsField.setFont(helveticaFont);
                  if (typeof obsField.setFontSize === 'function') obsField.setFontSize(10);
                  obsField.setText(obsRaw || '');
                }
              } catch (e) {
                // fallback genérico
                try {
                  const f = (form as any).getFieldMaybe ? (form as any).getFieldMaybe(obsName) : null;
                  if (f && typeof (f as any).setText === 'function') (f as any).setText(obsRaw || '');
                } catch (e2) {}
              }
            }
          }
        } catch (procErr) {
          console.warn('Error procesando seguridad_observaciones:', procErr);
        }
        // --- Nuevo: procesar equipo_item1..4 ---
      try {
  if (pm1Data.equipos && typeof pm1Data.equipos === 'string') {
    const equiposObj = JSON.parse(pm1Data.equipos);

    const page = pdfDoc.getPages()[0];
    const { width, height } = page.getSize();

    // 🧩 Fuentes
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // 🎨 Colores base
    const colorTexto = rgb(0.1, 0.1, 0.1);
    const colorCaja = rgb(0.97, 0.97, 0.97);
    const colorBorde = rgb(0.7, 0.7, 0.7);

    // 📍 Cuatro posiciones fijas para los grupos (una por esquina)
    const posiciones = [
      { x: 80, y: height - 165 },          // esquina superior izquierda
      { x: width / 2 + 40, y: height - 165 }, // esquina superior derecha
      { x: 80, y: height / 2 - 10 },       // esquina inferior izquierda
      { x: width / 2 + 40, y: height / 2 - 10 }, // esquina inferior derecha
    ];

    let grupoIndex = 0;

    // 🔁 Recorremos cada grupo EQUIPO_ITEM
    for (const key of Object.keys(equiposObj)) {
      if (grupoIndex >= posiciones.length) break; // solo 4 grupos

      const pos = posiciones[grupoIndex];
      const rawArray = equiposObj[key];
      let itemsArray: any[] = [];

      try {
        itemsArray = typeof rawArray === 'string' ? JSON.parse(rawArray) : rawArray;
      } catch {
        try {
          itemsArray = JSON.parse(JSON.parse(rawArray));
        } catch {
          console.warn(`No se pudo parsear ${key}`);
          continue;
        }
      }

      // 💫 Eliminamos texto del encabezado EQUIPO_ITEMX
      const tituloGrupo = key.replace(/EQUIPO_ITEM\d+/gi, '').trim();

      if (tituloGrupo) {
        page.drawText(tituloGrupo, {
          x: pos.x,
          y: pos.y,
          size: 8,
          font: helveticaBold,
          color: rgb(0, 0, 0),
        });
      }

      // Coordenada vertical interna del bloque
      let yItem = pos.y - 12;

      // 🔁 Dibujar ítems dentro de cada bloque/esquina
      for (const item of itemsArray) {
        const label = (item.label || '').replace(/EQUIPO_ITEM\d+/gi, '').trim();
        const valor = item.valor || (
          item.tipo === 'valores'
            ? (Array.isArray(item.valores) ? item.valores.join(', ') : String(item.valores))
            : ''
        );

        // Nombre del ítem
        page.drawText(`• ${label}`, {
          x: pos.x,
          y: yItem,
          size: 6.5,
          font: helveticaBold,
          color: colorTexto,
        });
        yItem -= 9;

        const boxWidth = 60;
        const boxHeight = 9;

        if (valor.includes(',')) {
          const [real, testigo] = valor.split(',').map((v: string) => v.trim());

          // Caja valor real
          page.drawRectangle({
            x: pos.x,
            y: yItem - 2,
            width: 28,
            height: boxHeight,
            color: colorCaja,
            borderColor: colorBorde,
            borderWidth: 0.4,
          });
          page.drawText(real, {
            x: pos.x + 3,
            y: yItem + 1,
            size: 5.5,
            font: helvetica,
            color: colorTexto,
          });

          // Caja valor testigo
          page.drawRectangle({
            x: pos.x + 33,
            y: yItem - 2,
            width: 28,
            height: boxHeight,
            color: colorCaja,
            borderColor: colorBorde,
            borderWidth: 0.4,
          });
          page.drawText(testigo, {
            x: pos.x + 36,
            y: yItem + 1,
            size: 5.5,
            font: helvetica,
            color: colorTexto,
          });

          yItem -= 16;
        } else {
          // Caja simple
          page.drawRectangle({
            x: pos.x,
            y: yItem - 2,
            width: boxWidth,
            height: boxHeight,
            color: colorCaja,
            borderColor: colorBorde,
            borderWidth: 0.4,
          });
          page.drawText(String(valor || ''), {
            x: pos.x + 3,
            y: yItem + 1,
            size: 5.5,
            font: helvetica,
            color: colorTexto,
          });

          // Texto adicional si contiene “buen estado”
          if (valor && valor.toLowerCase().includes('buen')) {
            page.drawText('Buen estado', {
              x: pos.x + 2,
              y: yItem - 8,
              size: 5,
              font: helvetica,
              color: rgb(0.3, 0.3, 0.3),
            });
            yItem -= 14;
          } else {
            yItem -= 12;
          }
        }
      }

      grupoIndex++;
    }
  }
} catch (err) {
  console.warn('Error procesando equipos para PDF:', err);
}





        // ...existing code...
        // Flatten the form to remove interactive widgets (no blue highlighting)
        try {
          if (typeof (form as any).flatten === 'function') {
            (form as any).flatten();
          }
        } catch (flattenErr) {
          console.warn('No se pudo aplanar el formulario (opcional):', flattenErr);
        }

        // ---------- IMÁGENES / FIRMAS ----------
        // Helpers to decode data URLs and embed images
        const getImageBytesFromDataUrl = (dataUrl: string): Uint8Array | null => {
          if (!dataUrl || typeof dataUrl !== 'string') return null;
          const matches = dataUrl.match(/^data:(image\/(png|jpeg|jpg));base64,(.*)$/);
          if (!matches) return null;
          const b64 = matches[3];
          const binary = atob(b64);
          const len = binary.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
          return bytes;
        };

        const embedImageToPdf = async (pdfDoc: any, dataUrl: string) => {
          const bytes = getImageBytesFromDataUrl(dataUrl);
          if (!bytes) return null;
          // detect PNG vs JPG
          if (dataUrl.startsWith('data:image/png')) return await pdfDoc.embedPng(bytes);
          return await pdfDoc.embedJpg(bytes);
        };

        const addImageToPage = (page: any, image: any, coords: { x: number; y: number; width: number; height: number }) => {
          try {
            page.drawImage(image, coords);
          } catch (e) {
            console.warn('No se pudo dibujar la imagen en la página:', e);
          }
        };

        // Get the first page to draw images/signatures
        const pages = pdfDoc.getPages();
        const page = pages[0];

        // Example coordinates (ajusta según tu plantilla)
        const firma1Coords = { x: 130, y: 2, width: 30, height: 20 };
        //const firma2Coords = { x: (page.getWidth ? page.getWidth() - 160 : 420), y: 40, width: 120, height: 40 };

        // Insert firma_1 and firma_2 if present (data URLs expected)
        try {
          if (pm1Data.firma_1) {
            const img1 = await embedImageToPdf(pdfDoc, pm1Data.firma_1);
            if (img1) addImageToPage(page, img1, firma1Coords);
          }
        } catch (e) {
          console.warn('Error insertando firma_1:', e);
        }

        /*try {
          if (pm1Data.firma_2) {
            const img2 = await embedImageToPdf(pdfDoc, pm1Data.firma_2);
            if (img2) addImageToPage(page, img2, firma2Coords);
          }
        } catch (e) {
          console.warn('Error insertando firma_2:', e);
        }*/
        // ---------- FIN IMÁGENES ----------
      } catch (err) {
        console.warn('Error rellenando campos:', err);
      }

      // 5️⃣ Guardar PDF modificado
  const modifiedPdfBytes = await pdfDoc.save();
  // modifiedPdfBytes is a Uint8Array; pass its underlying ArrayBuffer to Blob for typing
  return new Blob([modifiedPdfBytes as any], { type: 'application/pdf' });
    } catch (error) {
      console.error('Error procesando el PDF:', error);
      return null;
    }
  }

  // 🔹 Paso 2: Renderizar en <canvas>
  async renderPdf(id: number) {
    this.isRendering = true;
    const filledPdfBlob = await this.fillpdf(id);

    if (!filledPdfBlob) {
      console.error('No se pudo generar el PDF.');
      this.isRendering = false;
      return;
    }

    const pdfUrl = URL.createObjectURL(filledPdfBlob);
    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
    const page = await pdf.getPage(1);

    const canvas = this.pdfViewerpm.nativeElement;
    const context = canvas.getContext('2d');
    if (!context) {
      console.error('No se pudo obtener el contexto 2D del canvas.');
      this.isRendering = false;
      return;
    }
    const viewport = page.getViewport({ scale: 1.5 });

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport }).promise;
    this.isRendering = false;
  }

  // Compatibility wrapper used by other components: fetchAndSetPdf
  async fetchAndSetPdf(id: number): Promise<Blob | null> {
    // This service currently builds and returns the filled PDF blob directly
    return this.fillpdf(id);
  }

  // Compatibility wrapper named fillPdf (camelCase) to match callers
  async fillPdf(id: number, pdfData?: ArrayBuffer | Blob): Promise<Blob | undefined> {
    // Ignore pdfData for now (current implementation reads template from assets)
    const blob = await this.fillpdf(id);
    return blob ?? undefined;
  }





 


}

