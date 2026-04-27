import { Injectable } from '@angular/core';
import { SubestacionService } from './subestacion.service';
import { Spt2Service } from './spt2.service';
import { Subestacion } from '../interface/subestacion';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { MetodoCaidaService } from './metodo-caida.service';
import { MetodoSelectivoService } from './metodo-selectivo.service';
import { MetodoCaida } from '../interface/metodo-caida';
import { Reportefotografico } from '../interface/reportefotografico';
import { ReportefotograficoService } from './reportefotografico.service';
import { UsuarioService } from './usuario.service';
import { MetodoCaidaGraficaService } from './metodo-caida-grafica.service';
import { MetodoSelectivoGraficaService } from './metodo-selectivo-grafica.service';
import { TipostpService } from './tipostp.service';
import { MetodoMedicionService } from './metodo-medicion.service';
import { MedicionTelurometroService } from './medicion-telurometro.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorServiceService {


  private reporteFotografico: Reportefotografico[] = [];

  constructor(private subestacionService: SubestacionService,
    private spt2Service: Spt2Service,
    private metodoCaidaService: MetodoCaidaService,
    private MetodoSelectivoService : MetodoSelectivoService,
    private ReportefotograficoService :ReportefotograficoService,
    private MetodoCaidaGraficaService:MetodoCaidaGraficaService,
    private MetodoSelectivoGraficaService:MetodoSelectivoGraficaService,
    private UsuarioService :UsuarioService,
    private MetodoMedicionService:MetodoMedicionService,
    private TipostpService :TipostpService,
    private MedicionTelurometroService:MedicionTelurometroService

    ) {

    }


async generarPDF(id: number): Promise<Blob> {
      try {
        // Llamar al servicio y obtener el resultado como un array de objetos
        const resultado = await firstValueFrom(this.spt2Service.obtenerSpt2PorId(id));

        // Verificar si el resultado es válido
        if (!resultado) {
            console.error('No se encontraron resultados para el ID:', id);
            throw new Error('No se encontraron resultados para el ID proporcionado');
        }
        console.log('Datos recibidos:', resultado);
        const existingPdfBytes = await fetch('assets/spt2.pdf').then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const [newPage] = pdfDoc.getPages();
        const { width, height } = newPage.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const textSize = 8;

        const drawText = (text: string | undefined, x: number, y: number, color: [number, number, number] = [0, 0, 0]) => {
          if (!text) text = ''; // Evitar texto 'undefined' o 'null'
          newPage.drawText(text, { font, size: textSize, x, y, color: rgb(color[0], color[1], color[2]) });
        };

        // Asignar los valores directamente desde el objeto resultado
        drawText(resultado.datosSpt2.ot || '', 520, height - 195);
        drawText(resultado.datosSpt2.fecha || '', 740, height - 195);
        drawText(resultado.datosSpt2.usuario1_usuario || '', 835, height - 195);
        drawText(resultado.datosSpt2.usuario2_usuario, 795, height - 215);
        drawText(resultado.datosSpt2.ubicacion || '', 385, height - 215);
        drawText(resultado.datosSpt2.plano || '', 240, height - 232);
        drawText(resultado.datosSpt2.fecha_plano || '', 795, height - 232);
        drawText(resultado.datosSpt2.subestacion_versio?.toString() || '', 935, height - 235);

        const determinarMensaje = (valor: number): { mensaje: string, color: [number, number, number] } => {
          if (valor > 25) return { mensaje: "NO CUMPLE", color: [1, 0, 0] }; // Rojo
          if (valor > 0) return { mensaje: "CUMPLE", color: [0, 1, 0] }; // Verde
          return { mensaje: "", color: [0, 0, 0] }; // Negro (o sin color, ya que no se dibujará)
        };

        //drawText(tagParam, 240, height - 215);

        drawText(resultado.datosSpt2.tag_subestacion || '',240, height - 215)
        drawText(resultado.datosSpt2.usuario1_fotocheck?.toString(), 640, height - 1290);
        drawText(resultado.datosSpt2.usuario2_fotocheck?.toString(), 640, height - 1323);

        drawText(resultado.datosSpt2.usuario1_usuario , 262, height - 1290);
        drawText(resultado.datosSpt2.usuario2_usuario , 262, height - 1323);
              drawText(resultado.datosSpt2.marca, 190, height - 285);
              drawText(resultado.datosSpt2.n_serie, 400, height - 285);
              drawText(resultado.datosSpt2.modelo, 655, height - 285);
              drawText(resultado.datosSpt2.frecuencia, 800, height - 285);
              drawText(resultado.datosSpt2.fecha_calibracion, 885, height - 265);
              drawText(resultado.datosSpt2.precision, 925, height - 285);

              const yesImageBytes = await fetch('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAQmSURBVGhD7ZpJKH1RGMDve2QKGYuFEqUMiRAroUQ2hg0bGTLtZGOplCVZSSyIFEWKMmaj2KGkZCNDLIwb8/j973f63vPOO/dNf+8O79//V1/efee7dX73nHPP8JhARvoHMNNfn8dnRTY3N6WpqSm6ksGu5Uvc3t5CY2MjmEwmiIyMhJubG/a9T4ksLi5CXFwcjmkWOTk5cHp6ysp8QuTh4QFaWlpYK6CA2WyGzs5O+Pj4oAwfENnf34eUlBRrK4SFhcHs7CyV/mBokbGxMQgKCrJKJCcnw+HhIZXyGFLk9fUV2tvbrQIYhYWFcH9/TxkihhO5vr5mlbaVqK+vh7e3N8pQxlAiR0dHkJSUZBXAwd3d3Q3f39+U4RjDiGxtbbF5wSKBb6aBgQEqdY0hRJaXlyEkJMQq4efnB8PDw1TqHrqLzMzMgL+/PycxOjpKpe6jq8jExIR1ksPA7uRpS1jQTcReAj8PDg5SqefoIjI9Pc1JYPT09FDp36G5CC78bMcEBq6j3HnFOkNTEXkPwS05MCoqKuDz85My/h7NRA4ODiA8PJyTyM7OhsfHR8r4HZqIXFxcQEJCAicRHx8P5+fnlPF7VBfBJ44bIFsJ7F7b29uU4R1UFfn6+oKamhpOAt9WIyMjlOE9VBXp7e3lJDAaGhqo1LuoJrK0tCTMFRkZGfD8/EwZ3kUVkePjY4iIiOAkQkNDHe7uvIHXRV5eXiA3N5eTwFBjXNjCiby/v7ONfVNTE9TW1rLPns64XV1dgkRVVdWvZ25XWEX29vYgMzNTqERHRwd7+7jDysoKW8Ha3h8bGwtXV1eUoR5MZH5+HgIDA7kK2EZfXx9Ldgae+NkenllC6ehGDZgIdqmFhQVITEwUKoKBi7ydnR12gxLYberq6oT7qqurKUN9uDGCJxjp6elChTDy8vIcdjFsUft8XFddXl5ShvpwIsjJyYnw6rQE7iPswbMmXDfZ5/b391OGNggiyOTkpFAxjNTUVGHJ3dbWJuSlpaVx57JaoCiCXaigoECoIMbc3BxlAVv42b+lcDZfW1ujDO1QFEFwE2RbQUvk5+ezwY1PPCsrSygvLS1Vfc5QwqEIUlxcLFQUnzi2BJ522JfhUc7u7i7drS1ORdbX14XKYhQVFUFMTIzwfWVlJd2pPU5FsIsodR+lwLGiV2sgTkWQ8fFxxYrbR3l5Od2hDy5FcP8QHR2tWHlL4LjZ2NigO/TB5c/TwcHBUnNzM10pI88vUklJCV3pg1u/s7e2tkryGKArEXlSlORWoSudoJZxCg56+Ykrdis8Ebm7u6NM/XCrRfBpy/sSuvpBXhhKQ0NDUlRUFH2jIyTkkqenJ24xWVZWBmdnZ1SqP26LIPKgh4CAAPaTmB7LEGd49G9Oq6urkryTlOSlC31jHP7/v5axkKQ/E5O9NqOelV4AAAAASUVORK5CYII=').then(res => res.arrayBuffer());
                const yesImage = await pdfDoc.embedPng(yesImageBytes);

              const imageWidth = 10;
              const imageHeight = 10;

              const drawImageOrText = async (condition: boolean, x: number, y: number) => {
                if (condition) {
                  newPage.drawImage(yesImage, { x, y, width: imageWidth, height: imageHeight });
                } else {
                  drawText("", x, y); // Mostrar texto "NO" si la condición es falsa
                }
              };

                await drawImageOrText(resultado.datosSpt2.caida_potencia, 640, height - 340);
                await drawImageOrText(resultado.datosSpt2.selectivo, 729, height - 340);
                await drawImageOrText(resultado.datosSpt2.sin_picas, 789, height - 340);



                let contadorPatcaida = 1;


    //VARIBALE METODOS
    const startY = height - 610; // Posición inicial en la página para metodoCaida
    const lineHeight = 5; // Distancia entre cada registro completo en el array

    //METODO CAIDA
    drawText(resultado.metodoCaida[0]?.caida_conclusiones || '', 130, height - 610);

    // Dibujar encabezados PAT una sola vez (horizontal, arriba de los items)
    const yPatItemsCaida = height - 419; // Mismo Y para todos los valores de items en metodoCaida
    const yHeaderCaida = yPatItemsCaida + 14; // Encabezado PAT debe estar encima de los items
    drawText('PAT1', 375, yHeaderCaida);
    drawText('PAT2', 425, yHeaderCaida);
    drawText('PAT3', 475, yHeaderCaida);
    drawText('PAT4', 525, yHeaderCaida);

    // Columnas PAT fijas
    const xPat1 = 375;
    const xPat2 = 425;
    const xPat3 = 475;
    const xPat4 = 525;
    const patColumns = [xPat1, xPat2, xPat3, xPat4];
    const xOhm = 190;
    const xResultado = 270;

    resultado.metodoCaida.forEach((registro: any, registroIndex: number) => {
      // Cada registro ocupa una columna PAT
      if (registroIndex >= 4) return; // Máximo 4 registros (PAT1-PAT4)

      const xPat = patColumns[registroIndex]; // Columna asignada a este registro
      
      // Mantener la sección vertical sin cambios
      const currentYohm = startY - registroIndex * lineHeight * 4;
      const yOhmResultado = currentYohm + 90;
      const yPat = yPatItemsCaida; // Mismos valores Y para todas las columnas

      // Dibujar PAT label, OHM y RESULTADO en la fila vertical (a la izquierda)
      drawText(`PAT${registroIndex + 1}`, 130, yOhmResultado);
      drawText(registro.ohm?.toString() || '', xOhm, yOhmResultado);
      
      const resultadoColor: [number, number, number] = registro.resultado === 'CUMPLE'
        ? [0, 1, 0]
        : [1, 0, 0];
      drawText(registro.resultado?.toString() || '', xResultado, yOhmResultado, resultadoColor);

      // Los items de este registro se dibujan en su columna PAT asignada
      const val1 = (registro as any).item1 ?? (registro as any).pat1;
      const val2 = (registro as any).item2 ?? (registro as any).pat2;
      const val3 = (registro as any).item3 ?? (registro as any).pat3;

      drawText(val1?.toString() || '', xPat, yPat- 4);
      drawText(val2?.toString() || '', xPat, yPat - 14.5);
      drawText(val3?.toString() || '', xPat, yPat - 29);
  });


  let contadorPatselectivo = 1;

// Método Selectivo
drawText(resultado.metodoSelectivo[0]?.selectivo_conclusiones || '', 130, height - 905);

// Dibujar encabezados PAT una sola vez (horizontal, arriba de los items)
const yPatItemsSelectivo = height - 706; // Mismo Y para todos los valores de items en metodoSelectivo
const yHeaderSelectivo = yPatItemsSelectivo + 20; // Encabezado PAT debe estar encima de los items
drawText('PAT1', 375, yHeaderSelectivo);
drawText('PAT2', 425, yHeaderSelectivo);
drawText('PAT3', 475, yHeaderSelectivo);
drawText('PAT4', 525, yHeaderSelectivo);

// Columnas PAT fijas
const xPatS1 = 375;
const xPatS2 = 425;
const xPatS3 = 475;
const xPatS4 = 525;
const patColumnsS = [xPatS1, xPatS2, xPatS3, xPatS4];
const xOhmS = 190;
const xResultadoS = 270;

resultado.metodoSelectivo.forEach((registro, registroIndex) => {
  // Cada registro ocupa una columna PAT
  if (registroIndex >= 4) return; // Máximo 4 registros (PAT1-PAT4)

  const xPat = patColumnsS[registroIndex]; // Columna asignada a este registro
  
  // Posición Y para esta fila de registro (vertical)
  const currentY = startY - registroIndex * lineHeight * 2.2;
  const currentYohm = startY - registroIndex * lineHeight * 4;
  const yOhmResultado = currentYohm - 205;
  const yPat = yPatItemsSelectivo; // Mismos valores Y para todas las columnas

  // Dibujar PAT label, OHM y RESULTADO en la fila vertical (a la izquierda)
  drawText(`PAT${registroIndex + 1}`, 130, yOhmResultado);
  drawText(registro.ohm?.toString() || '', xOhmS, yOhmResultado, [0, 0, 0]);
  
  const resultadoColor: [number, number, number] = registro.resultado === 'CUMPLE'
    ? [0, 1, 0]
    : [1, 0, 0];
  drawText(registro.resultado?.toString() || '', xResultadoS, yOhmResultado, resultadoColor);

  // Los items de este registro se dibujan en su columna PAT asignada
  const sval1 = (registro as any).item1 ?? (registro as any).pat1;
  const sval2 = (registro as any).item2 ?? (registro as any).pat2;
  const sval3 = (registro as any).item3 ?? (registro as any).pat3;

  drawText(sval1?.toString() || '', xPat, yPat, [0, 0, 0]);
  drawText(sval2?.toString() || '', xPat, yPat - 15, [0, 0, 0]);
  drawText(sval3?.toString() || '', xPat, yPat - 30, [0, 0, 0]);
});



let contadorPatsujecion = 1; // Inicializamos el contador en 1

// Definimos un tipo para las claves de posicionesY
type ClavePAT = "PAT1" | "PAT2" | "PAT3" | "PAT4";

// Definimos las posiciones Y para cada PAT
const posicionesY: Record<ClavePAT, number> = {
  PAT1: height - 1015, // Posición Y para PAT1
  PAT2: height - 1035, // Posición Y para PAT2
  PAT3: height - 1055, // Posición Y para PAT3
  PAT4: height - 1075, // Posición Y para PAT4
};

// Recorremos todos los elementos del array
resultado.metodoSujecion.forEach((item) => {
  // Verificamos si el elemento es válido para mostrarse en el PDF
  const esValido =
    item.ohm !== "null" &&
    item.ohm !== null &&
    item.ohm !== "0" &&
    item.ohm !== "" &&
    item.resultado !== "";

  // Si el elemento es válido, lo dibujamos en el PDF
  if (esValido) {
    const mensaje = `PAT${contadorPatsujecion}` as ClavePAT; // Aseguramos que mensaje es una clave válida
    const posY = posicionesY[mensaje]; // Usamos la posición Y correspondiente al PAT actual

    // Dibujamos el texto del PAT
    drawText(mensaje, 190, posY);

    // Dibujamos los valores de `ohm` y `resultado`
    const xOhm = 260;
    const xResultado = 340;
    const yOhmResultado = posY; // Misma posición vertical que el PAT

    drawText(item.ohm?.toString() || '', xOhm, yOhmResultado, [0, 0, 0]);

    const resultadoColor: [number, number, number] = item.resultado === 'CUMPLE'
      ? [0, 1, 0] // Verde (0, 1, 0)
      : [1, 0, 0]; // Rojo (1, 0, 0)

    drawText(item.resultado?.toString() || '', xResultado, yOhmResultado, resultadoColor);
  }

  // Incrementamos el contador para todos los elementos, incluso los no válidos
  contadorPatsujecion++;
});
drawText(resultado.metodoSujecion[0]?.sujecion_conclusiones || '', 128, height - 1106);
// Función para convertir Base64 a ArrayBuffer
const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes.buffer;
};

// Función para agregar una imagen al PDF desde Base64
const addImageToPdf = async (
  pdfDoc: PDFDocument,
  newPage: any,
  base64: string,
  x: number,
  y: number,
  width: number,
  height: number
) => {
  if (!base64) {
    console.warn('Base64 vacío. No se dibujará nada.');
    return;
  }

  try {
    // Convertir Base64 a ArrayBuffer
    const cleanBase64 = base64.includes(',')
  ? base64.split(',')[1]
  : base64;

const imageBytes = base64ToArrayBuffer(cleanBase64);

    // Detectar el tipo de imagen y embederla en el PDF
    let image;
    try {
      image = await pdfDoc.embedPng(imageBytes); // Intentar como PNG
    } catch {
      image = await pdfDoc.embedJpg(imageBytes); // Intentar como JPG
    }

    // Dibujar la imagen en el PDF
    newPage.drawImage(image, { x, y, width, height });
  } catch (error) {
    console.error(`Error al incrustar la imagen (${base64}):`, error);
  }
};

// Uso de la función para incrustar imágenes
await addImageToPdf(
  pdfDoc,
  newPage,
  resultado.datosSpt2.usuario1_firma || '',
  810,
  height - 1302,
  100,
  30
);

if (resultado.datosSpt2.firmado === true) {
  await addImageToPdf(
    pdfDoc,
    newPage,
    resultado.datosSpt2.usuario2_firma || '',
    810,
    height - 1336,
    100,
    30
  );
}



     /*

    // Dibujar imágenes externas
    await addImageToPdf(pdfDoc, newPage, resultado.datosSpt2.imagen1, 150, height - 1260, 150, 100);
    await addImageToPdf(pdfDoc, newPage, resultado.datosSpt2.imagen2, 350, height - 1260, 150, 100);
    await addImageToPdf(pdfDoc, newPage, resultado.datosSpt2.imagen3, 550, height - 1260, 150, 100);
    await addImageToPdf(pdfDoc, newPage, resultado.datosSpt2.imagen4, 750, height - 1260, 150, 100);

    await addImageToPdf(pdfDoc, newPage, resultado.metodoCaida[0]?.caida_esquema || '', 582, height - 575, 250, 185);
    await addImageToPdf(pdfDoc, newPage, resultado.metodoSelectivo[0]?.selectivo_esquema || '', 582, height - 870, 250, 185);

*/
  // Preparar imágenes de reporte fotográfico (preferir `reporteFotografico`, fallback a `datosSpt2.imagenX`)
  const rf = (resultado as any).reporteFotografico || [];
  const foto1 = rf[0]?.imagen || resultado.datosSpt2.imagen1 || '';
  const foto2 = rf[1]?.imagen || resultado.datosSpt2.imagen2 || '';
  const foto3 = rf[2]?.imagen || resultado.datosSpt2.imagen3 || '';
  const foto4 = rf[3]?.imagen || resultado.datosSpt2.imagen4 || '';

  // Procesar las imágenes Base64 y dibujarlas en posiciones específicas (sin cambiar posiciones)
  const images = [
    { base64: foto1, x: 150, y: height - 1260,  width: 150, height: 85 },
    { base64: foto2, x: 350, y: height - 1260,  width: 150, height: 85},
    { base64: foto3, x: 550, y: height - 1260, width: 150, height: 85 },
    { base64: foto4, x: 750, y: height - 1260,  width: 150, height: 85},
    { base64: resultado.metodoSelectivo[0]?.selectivo_esquema || '', x: 582, y: height - 870, width: 250, height: 185 },
    { base64: resultado.metodoCaida[0]?.caida_esquema || '', x: 582, y: height - 575, width: 250, height: 185 },
  ].filter(image => image.base64); // Filtrar solo imágenes con base64 válido

  // Procesar y dibujar cada imagen
  for (const image of images) {
    try {
      // Normalizar base64 (quitar prefijo data: si existe)
      const cleanBase64 = image.base64.includes(',') ? image.base64.split(',')[1] : image.base64;
      const mimeType = detectImageMimeType(cleanBase64);
      const imageBytes = base64ToUint8Array(cleanBase64);
      const embeddedImage = await embedImage(pdfDoc, imageBytes, mimeType);

      // Usar dimensiones específicas
      const imageDims = { width: image.width, height: image.height };

      // Dibujar la imagen
      newPage.drawImage(embeddedImage, {
        x: image.x,
        y: image.y,
        width: imageDims.width,
        height: imageDims.height,
      });
    } catch (error) {
      console.error('Error al procesar la imagen:', error);
      continue;
    }
  }



    // Guardar el PDF modificado
    const modifiedPdfBytes = await pdfDoc.save();
    const modifiedPdfBlob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });

    console.log('El PDF con múltiples imágenes se generó correctamente.');
    const blobUrl = URL.createObjectURL(modifiedPdfBlob);
    window.open(blobUrl, '_blank');

    // Retornar el blob generado
    return modifiedPdfBlob;

    } catch (error) {
    console.error('Error al generar el PDF:', error);
    throw error; // Relanzar el error para manejarlo externamente si es necesario
    }
    }
  }

  function detectImageMimeType(base64: string): string {
    const cleanBase64 = base64.includes(',') ? base64.split(',')[1] : base64;
    if (cleanBase64.startsWith('/9j')) {
      return 'image/jpeg';
    } else if (cleanBase64.startsWith('iVBORw')) {
      return 'image/png';
    } else {
      throw new Error('Formato de imagen no soportado.');
    }
    }

    // Función auxiliar: Convertir Base64 a Uint8Array
    function base64ToUint8Array(base64: string): Uint8Array {
      const cleanBase64 = base64.includes(',') ? base64.split(',')[1] : base64;
      const binaryString = atob(cleanBase64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
    }

    // Función auxiliar: Incrustar imagen en el PDF
    async function embedImage(pdfDoc: PDFDocument, imageBytes: Uint8Array, mimeType: string) {
    if (mimeType === 'image/png') {
    return await pdfDoc.embedPng(imageBytes);
    } else if (mimeType === 'image/jpeg') {
    return await pdfDoc.embedJpg(imageBytes);
    } else {
    throw new Error('Formato de imagen no soportado.');
    }
    }

// Función auxiliar: Detectar el tipo MIME de la imagen
