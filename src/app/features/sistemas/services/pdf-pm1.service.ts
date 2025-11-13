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
  isRendering = false;
  pm1DataCache: BuscarPM1PorId | null = null;

  constructor(private http: HttpClient, private PM1Service: PM1Service) {
    this.pm1 = {} as BuscarPM1PorId;
  }

  ngOnInit(): void {}

  // 🔹 Compresor de imágenes Base64 para evitar cuellos de botella
  private async compressBase64Image(base64: string, maxWidth = 800): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = Math.min(1, maxWidth / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.7)); // 70% calidad
      };
    });
  }

// ✅ PdfPm1Service final y estable
async fillpdf(id: number, data?: any, imagenBase64?: string[]): Promise<Blob | null> {
  try {
    const pm1Data = await this.PM1Service.getPM1ById(id).toPromise();
    if (!pm1Data) {
      console.error('No se pudieron obtener los datos de PM1.');
      return null;
    }
    this.pm1 = pm1Data;

    const pdfBytes = await this.http
      .get('assets/plantilla_service.pdf', { responseType: 'arraybuffer' })
      .toPromise();

    if (!pdfBytes) {
      console.error('No se encontró el PDF plantilla.');
      return null;
    }

    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const safe = (v: any) => (v == null ? '' : String(v));
    const fieldMap: Record<string, string> = {
      subestacion: safe(pm1Data.tag_subestacion),
      transformador: safe(pm1Data.transformador),
      ubicacion: safe(pm1Data.ubicacion),
      orden_trabajo: safe(pm1Data.orden_trabajo),
      hora_inicio: safe(pm1Data.hora_inicio),
      hora_fin: safe(pm1Data.hora_fin),
      fecha: safe(pm1Data.fecha),
      potencia_actual: safe(pm1Data.potencia_actual),
      corriente_actual: safe(pm1Data.corriente_actual),
      tecnico: safe(pm1Data.correo_tecnico),
      supervisor: safe(pm1Data.correo_supervisor),
      fotocheck_tecnico: safe(pm1Data.fotocheck_tecnico),
      fotocheck_supervisor: safe(pm1Data.fotocheck_supervisor),
    };

  // --- Procesar seguridad_observaciones ---
try {
  if (pm1Data.seguridad_observaciones) {
    let rows: any[] = [];

    // Asegurarse de que sea un array JSON válido
    if (typeof pm1Data.seguridad_observaciones === 'string') {
      try {
        rows = JSON.parse(pm1Data.seguridad_observaciones);
      } catch {
        rows = [];
      }
    } else if (Array.isArray(pm1Data.seguridad_observaciones)) {
      rows = pm1Data.seguridad_observaciones;
    }

    // Campos: BUENO_1..4, NA_1..4, OBSERVACION_1..4
    for (let i = 0; i < Math.min(rows.length, 4); i++) {
      const { estado = '', observacion = '' } = rows[i];
      const estadoUp = estado.toUpperCase();

      const buenoName = `bueno_${i + 1}`;
      const naName = `na_${i + 1}`;
      const obsName = `observacion_${i + 1}`;

      const clear = (n: string) => {
        try { const cb = form.getCheckBox(n); if (cb) (cb as any).uncheck(); } catch {}
      };
      [buenoName, naName].forEach(clear);

      if (estadoUp === 'BUENO') (form.getCheckBox(buenoName) as any)?.check();
      else if (estadoUp === 'NA') (form.getCheckBox(naName) as any)?.check();

      try {
        const field = form.getTextField(obsName) as any;
        field?.setFont?.(helveticaFont);
        field?.setFontSize?.(7);
        field?.setText(observacion || '');
      } catch {}
    }
  }
} catch (e) {
  console.warn('Error procesando seguridad_observaciones:', e);
}

// --- Procesar patio_observaciones ---
try {
  if (pm1Data.patio_observaciones) {
    let rows: any[] = [];

    if (typeof pm1Data.patio_observaciones === 'string') {
      try { rows = JSON.parse(pm1Data.patio_observaciones); } catch { rows = []; }
    } else if (Array.isArray(pm1Data.patio_observaciones)) {
      rows = pm1Data.patio_observaciones;
    }

    // Campos: BUENO_5..8, MALO_1..4, NA_5..8, OBSERVACION_5..8
    for (let i = 0; i < Math.min(rows.length, 4); i++) {
      const { estado = '', observacion = '' } = rows[i];
      const estadoUp = estado.toUpperCase();
      const texto = observacion ||  '';

      const buenoName = `bueno_${5 + i}`;
      const maloName = `malo_${1 + i}`;
      const naName = `na_${5 + i}`;
      const obsName = `observacion_${5 + i}`;

      const clear = (n: string) => {
        try { const cb = form.getCheckBox(n); if (cb) (cb as any).uncheck(); } catch {}
      };
      [buenoName, maloName, naName].forEach(clear);

      if (estadoUp === 'BUENO') (form.getCheckBox(buenoName) as any)?.check();
      else if (estadoUp === 'MALO') (form.getCheckBox(maloName) as any)?.check();
      else if (estadoUp === 'NA') (form.getCheckBox(naName) as any)?.check();

      try {
        const field = form.getTextField(obsName) as any;
        field?.setFont?.(helveticaFont);
        field?.setFontSize?.(7);
        field?.setText(texto || '');
      } catch {}
    }
  }
} catch (e) {
  console.warn('Error procesando patio_observaciones:', e);
}

// --- Procesar aviso_observaciones ---
try {
  if (pm1Data.aviso_observaciones) {
    let rows: any[] = [];

    // ✅ Convertir string JSON a array de objetos
    if (typeof pm1Data.aviso_observaciones === 'string') {
      try {
        rows = JSON.parse(pm1Data.aviso_observaciones);
      } catch (err) {
        console.error('❌ Error al parsear aviso_observaciones:', err);
        rows = [];
      }
    } else if (Array.isArray(pm1Data.aviso_observaciones)) {
      rows = pm1Data.aviso_observaciones;
    }

    // ✅ Procesar hasta 5 registros
    for (let i = 0; i < Math.min(rows.length, 5); i++) {
      const { estado = '', solicitud = '', recomendacion = '' } = rows[i];
      const estadoUp = estado.toUpperCase();

      // Nombres de los campos PDF
      const maloName = `malo_${5 + i}`;
      const buenoName = `bueno_${9 + i}`;
      const solicitudName = `solicitud_${1 + i}`;
      const recomendacionName = `recomendacion_${1 + i}`;

      // ✅ Desmarcar primero los checkboxes anteriores
      const clearCheckbox = (name: string) => {
        try {
          const cb = form.getCheckBox(name);
          if (cb && (cb as any).isChecked()) (cb as any).uncheck();
        } catch (err) {
          console.warn(`⚠️ No se pudo limpiar checkbox ${name}:`, err);
        }
      };
      [maloName, buenoName].forEach(clearCheckbox);

      // ✅ Marcar según el estado
      try {
        if (estadoUp === 'MALO') (form.getCheckBox(maloName) as any)?.check();
        else if (estadoUp === 'BUENO') (form.getCheckBox(buenoName) as any)?.check();
      } catch (err) {
        console.warn(`⚠️ No se pudo marcar estado en fila ${i + 1}:`, err);
      }

      // ✅ Escribir texto en campos de solicitud y recomendación
      const writeText = (fieldName: string, value: string) => {
        try {
          const field = form.getTextField(fieldName) as any;
          if (field) {
            field?.setFont?.(helveticaFont);
            field?.setFontSize?.(7);
            field?.setText(value || '');
          }
        } catch (err) {
          console.warn(`⚠️ No se pudo escribir en ${fieldName}:`, err);
        }
      };

      writeText(solicitudName, solicitud);
      writeText(recomendacionName, recomendacion);
    }

    console.log('✅ aviso_observaciones procesado correctamente:', rows);
  } else {
    console.log('ℹ️ No se encontró aviso_observaciones en pm1Data.');
  }
} catch (e) {
  console.warn('❌ Error general procesando aviso_observaciones:', e);
}

  // --- Nuevo: procesar equipo_item1..4 ---
        try {
  if (pm1Data.equipos && typeof pm1Data.equipos === 'string') {
    const equiposObj = JSON.parse(pm1Data.equipos);
    const page = pdfDoc.getPages()[0];
    const { width, height } = page.getSize();

    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const colorTexto = rgb(0.1, 0.1, 0.1);
    const colorCaja = rgb(0.97, 0.97, 0.97);
    const colorBorde = rgb(0.7, 0.7, 0.7);

    const posiciones = [
      { x: 80, y: height - 180 },
      { x: width / 2 + 150, y: height - 180 },
      { x: 80, y: height / 2 - 1 },
      { x: width / 2 + 150, y: height / 2 - 1 },
    ];

    let grupoIndex = 0;

    for (const key of Object.keys(equiposObj)) {
      if (grupoIndex >= posiciones.length) break;
      const pos = posiciones[grupoIndex];
      const rawArray = equiposObj[key];
      let itemsArray: any[] = [];

      try {
        itemsArray = typeof rawArray === 'string' ? JSON.parse(rawArray) : rawArray;
      } catch {
        console.warn(`No se pudo parsear ${key}`);
        continue;
      }

      const tituloGrupo = key.replace(/EQUIPO_ITEM\d+/gi, '').trim();

      if (tituloGrupo) {
        page.drawText(tituloGrupo, {
          x: pos.x,
          y: pos.y,
          size: 9, // 🔹 texto del título más pequeño
          font: helveticaBold,
          color: rgb(0, 0, 0),
        });
      }

      let yItem = pos.y - 10; // 🔹 menos espacio inicial

      for (const item of itemsArray) {
        let label = (item.label || '').replace(/EQUIPO_ITEM\d+/gi, '').trim();
        let valor = item.valor || (
          item.tipo === 'valores'
            ? (Array.isArray(item.valores) ? item.valores.join(', ') : String(item.valores))
            : ''
        );

        // 🧩 Divide texto largo (2 líneas máximo)
        if (label.length > 30) {
          const palabras = label.split(' ');
          const mitad = Math.ceil(palabras.length / 2);
          label = palabras.slice(0, mitad).join(' ') + '\n' + palabras.slice(mitad).join(' ');
        }

        // 🧩 Dibuja texto (sin puntos, más compacto)
        const lineas = label.split('\n');
        for (const linea of lineas) {
          page.drawText(linea, {
            x: pos.x, // 🔹 sin indentación de punto
            y: yItem,
            size: 5.5, // 🔹 texto más pequeño
            font: helveticaBold,
            color: colorTexto,
          });
          yItem -= 7; // 🔹 menos padding entre líneas
        }

        const boxWidth = 58;
        const boxHeight = 8;
        valor = valor.replace(/[\[\]"]/g, '').trim();

        let unidad = '';
        const normalize = (str: string) =>
          str
            .toLowerCase()
            .normalize('NFD') // 🔹 separa los acentos
            .replace(/[\u0300-\u036f]/g, ''); // 🔹 elimina los acentos

        const labelNorm = normalize(label);

        if (labelNorm.includes('manovacuometro')) unidad = 'kgf/cm²';
        if (labelNorm.includes('termometro')) unidad = '°C';

        if (valor.includes(',')) {
          const [real, testigo] = valor.split(',').map((v: string) => v.trim());

          // Caja 1
          page.drawRectangle({
            x: pos.x,
            y: yItem - 2,
            width: 26,
            height: boxHeight,
            color: colorCaja,
            borderColor: colorBorde,
            borderWidth: 0.4,
          });
          page.drawText(real, {
            x: pos.x + 3,
            y: yItem + 1,
            size: 5,
            font: helvetica,
            color: colorTexto,
          });

          // Caja 2
          page.drawRectangle({
            x: pos.x + 32,
            y: yItem - 2,
            width: 26,
            height: boxHeight,
            color: colorCaja,
            borderColor: colorBorde,
            borderWidth: 0.4,
          });
          page.drawText(testigo, {
            x: pos.x + 35,
            y: yItem + 1,
            size: 5,
            font: helvetica,
            color: colorTexto,
          });

          // Unidad
          if (unidad) {
            page.drawText(unidad, {
              x: pos.x + 63,
              y: yItem + 1,
              size: 5,
              font: helvetica,
              color: colorTexto,
            });
          }

          yItem -= 13; // 🔹 menos espacio entre ítems
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
          page.drawText(valor, {
            x: pos.x + 3,
            y: yItem + 1,
            size: 5,
            font: helvetica,
            color: colorTexto,
          });

          // Unidad si aplica
          if (unidad) {
            page.drawText(unidad, {
              x: pos.x + boxWidth + 5,
              y: yItem + 1,
              size: 5,
              font: helvetica,
              color: colorTexto,
            });
          }

          yItem -= 11; // 🔹 más compacto
        }
      }

      grupoIndex++;
    }
  }
} catch (err) {
  console.warn('Error procesando equipos para PDF:', err);
}


    // 🔹 Rellenar campos
    for (const field of form.getFields()) {
      const name = field.getName();
      if (fieldMap[name]) {
        try {
          const textField = form.getTextField(name);
          textField.setText(fieldMap[name]);
          textField.setFontSize(7);
        } catch {}
      }
    }

    (form as any).updateFieldAppearances(helveticaFont);

    // 🔹 Insertar imágenes comprimidas
    const getImageBytes = (dataUrl: string): Uint8Array | null => {
      const match = dataUrl.match(/^data:(image\/(png|jpeg|jpg));base64,(.*)$/);
      if (!match) return null;
      const binary = atob(match[3]);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      return bytes;
    };

    const embedImage = async (pdfDoc: any, dataUrl: string) => {
      const bytes = getImageBytes(dataUrl);
      if (!bytes) return null;
      return dataUrl.startsWith('data:image/png')
        ? await pdfDoc.embedPng(bytes)
        : await pdfDoc.embedJpg(bytes);
    };

    const page = pdfDoc.getPages()[0];

    if (imagenBase64?.length) {
      let yPos = 470;
      for (const base64 of imagenBase64) {
        const compressed = await this.compressBase64Image(base64);
        const img = await embedImage(pdfDoc, compressed);
        if (img) {
          page.drawImage(img, { x: 205, y: yPos, width: 220, height: 130 });
          yPos -= 230;
        }
      }
    }

    // 🔹 Firmas
    const firma1 = { x: 190, y: 2, width: 45, height: 25 };
    const firma2 = { x: 400, y: 2, width: 45, height: 25 };

    if (pm1Data.firma_1) {
      const img1 = await embedImage(pdfDoc, pm1Data.firma_1);
      if (img1) page.drawImage(img1, firma1);
    }

    if (pm1Data.firma === true && pm1Data.firma_2) {
      const img2 = await embedImage(pdfDoc, pm1Data.firma_2);
      if (img2) page.drawImage(img2, firma2);
    }



    form.flatten();
    const modifiedPdfBytes = await pdfDoc.save();

// ✅ Solución final sin error de tipos
 return new Blob([new Uint8Array(modifiedPdfBytes)], { type: 'application/pdf' });
  } catch (error) {
    console.error('Error procesando el PDF:', error);
    return null;
  }
}

// 🔹 Renderizar PDF en navegador
async renderPdf(id: number) {
  this.isRendering = true;
  const filledPdfBlob = await this.fillpdf(id);
  if (!filledPdfBlob) {
    this.isRendering = false;
    console.error('No se pudo generar el PDF.');
    return;
  }
  const pdfUrl = URL.createObjectURL(filledPdfBlob);
  window.open(pdfUrl, '_blank');
  this.isRendering = false;
}

// 🔹 Compatibilidad para header.component
async fetchAndSetPdf(id: number): Promise<Blob | undefined> {
  const blob = await this.fillpdf(id);
  return blob ?? undefined;
}

// 🔹 Versión rápida para abrir PDF
async viewPdf(id: number, data?: any, imagenesBase64?: string[]): Promise<Blob | undefined> {
  const blob = await this.fillpdf(id, data, imagenesBase64);
  if (blob) {
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }
  return blob ?? undefined; // ✅ devuelve blob para que el .then(...) siga funcionando
}






































































/*
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
  async fillpdf(id: number, data?: any, imagenBase64?: string[]): Promise<Blob | null> {
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
        .get('assets/plantilla_service.pdf', { responseType: 'arraybuffer' })
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
                  if (typeof textField.setFontSize === 'function') textField.setFontSize(7);
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
    
    
        // --- Procesar seguridad_observaciones ---


// --- Procesar patio_observaciones ---


// --- Procesar aviso_observaciones ---


        // ...existing code...
        // Update appearances so saved PDF shows the text
        try {
          (form as any).updateFieldAppearances(helveticaFont);
        } catch (updateErr) {
          console.warn('No se pudo actualizar apariencias de campos (opcional):', updateErr);
        }
        // --- Nuevo: procesar equipo_item1..4 ---




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


        
      // ✅ USAR imagenesBase64 RECIBIDAS DESDE EL COMPONENTE
console.log('Intentando insertar imágenes (desde parámetro):', imagenBase64?.length ? `${imagenBase64.length} imágenes` : 'No existen');

if (imagenBase64 && imagenBase64.length > 0) {
  // posición inicial Y (puedes ajustar según tu plantilla)
  let yPos = 470;

  for (const base64 of imagenBase64) {
    const imgTransformador = await embedImageToPdf(pdfDoc, base64);

    if (imgTransformador) {
      console.log('✅ Imagen embebida correctamente en el PDF');
      addImageToPage(page, imgTransformador, {
        x: 205,
        y: yPos,
        width: 220,
        height: 130,
      });

      // mover la siguiente imagen más abajo o donde necesites
      yPos -= 230;
    } else {
      console.warn('⚠️ No se pudo embeber una de las imágenes (posiblemente base64 inválido)');
    }
  }
} else {
  console.warn('⚠️ No se recibieron imágenes desde el componente');
}


        
        // Coordenadas (ajusta según tu plantilla)
const firma1Coords = { x: 190, y: 2, width: 45, height: 25 };
const firma2Coords = { x: (page.getWidth ? page.getWidth() - 200 : 400), y: 2, width: 45, height: 25 };

// 🖋️ Firma 1
try {
  if (pm1Data.firma_1) {
    const img1 = await embedImageToPdf(pdfDoc, pm1Data.firma_1);
    if (img1) addImageToPage(page, img1, firma1Coords);
  }
} catch (e) {
  console.warn('Error insertando firma_1:', e);
}

// 🖋️ Firma 2 (solo si pm1Data.firma es true)
try {
  if (pm1Data.firma === true && pm1Data.firma_2) {
    const img2 = await embedImageToPdf(pdfDoc, pm1Data.firma_2);
    if (img2) addImageToPage(page, img2, firma2Coords);
  } else {
    console.log('🟡 Firma 2 omitida (firma = false o sin imagen)');
  }
} catch (e) {
  console.warn('Error insertando firma_2:', e);
}

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

  async viewPdf(id: number, data?: any, imagenesBase64?: string[]): Promise<Blob | undefined> {
  const blob = await this.fillpdf(id, data, imagenesBase64);
  return blob ?? undefined;
}
*/



}
