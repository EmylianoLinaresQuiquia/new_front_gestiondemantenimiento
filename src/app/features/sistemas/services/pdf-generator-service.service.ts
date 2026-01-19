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

                resultado.metodoCaida.forEach((item, index) => {
                  // Verificamos que el item y item.resultado existan y tengan longitud mayor a 0
                  const registroCount = item.resultado?.length || 0;
                  const mensaje = registroCount > 0 ? `PAT${contadorPatcaida}` : '';

                  // Solo dibuja el texto si hay mensaje
                  if (mensaje) {
                    // Ajusta las coordenadas en función del índice para evitar superposición
                    const posY = height - 500 - (contadorPatcaida * 20); // Ejemplo: ajusta 20px de separación entre textos
                    drawText(mensaje, 135, posY);

                    // Incrementa el contador para el siguiente mensaje
                    contadorPatcaida++;
                  }
                });


    //VARIBALE METODOS
    const startY = height - 610; // Posición inicial en la página para metodoCaida
    const lineHeight = 5; // Distancia entre cada registro completo en el array

    //METODO CAIDA
    drawText(resultado.metodoCaida[0]?.caida_conclusiones || '', 130, height - 610);

    resultado.metodoCaida.forEach((registro: any, index: number) => {
      const currentY = startY - index * lineHeight * 2; // Ajusta el espacio entre registros completos
      const currentYohm = startY - index * lineHeight * 4;
      const xRegistro = 100;
      const xOhm = 190;
      const xResultado = 270;
      const xPat1 = 375;
      const xPat2 = 425;
      const xPat3 = 475;
      const xPat4 = 525;
      const yOhmResultado = currentYohm + 90; // Para Ohm y Resultado, ligeramente por debajo de Conclusiones
      const yPat = currentY + 185; // Exclusiva para los valores Pat, más abajo para evitar superposición
      const resultadoColor: [number, number, number] = registro.resultado === 'CUMPLE'
    ? [0, 1, 0] // Verde (0, 1, 0)
    : [1, 0, 0]; // Rojo (1, 0, 0)

      // Ohm y Resultado en yOhmResultado
      drawText(registro.ohm?.toString() || '', xOhm, yOhmResultado);
      drawText(registro.resultado?.toString() || '', xResultado, yOhmResultado,resultadoColor);

      // Valores de Pat en la posición yPat
      drawText(registro.pat1?.toString() || '', xPat1, yPat);
      drawText(registro.pat2?.toString() || '', xPat2, yPat);
      drawText(registro.pat3?.toString() || '', xPat3, yPat);
      drawText(registro.pat4?.toString() || '', xPat4, yPat);
  });




  let contadorPatselectivo = 1;
resultado.metodoSelectivo.forEach((item, index) => {
  const registroCount = item.resultado?.length || 0;
  if (registroCount > 0) {
    const mensaje = `PAT${contadorPatselectivo}`;
    const posY = height - 795 - (contadorPatselectivo * 20);
    drawText(mensaje, 135, posY);
    contadorPatselectivo++;
  }
});

// Método Selectivo
drawText(resultado.metodoSelectivo[0]?.selectivo_conclusiones || '', 130, height - 905);

resultado.metodoSelectivo.forEach((registro, index) => {
  const currentY = startY - index * lineHeight * 2.2;
  const currentYohm = startY - index * lineHeight * 4;

  const xOhm = 190;
  const xPat1 = 375;
  const xPat2 = 425;
  const xPat3 = 475;
  const xPat4 = 525;
  const xResultado = 270;

  const yOhmResultado = currentYohm - 205;
  const yPat = currentY - 100;

  const resultadoColor: [number, number, number] = registro.resultado === 'CUMPLE'
    ? [0, 1, 0]
    : [1, 0, 0];

  // Asegúrate de convertir los valores a cadenas de texto antes de pasarlos a drawText
  drawText(registro.ohm?.toString() || '', xOhm, yOhmResultado, [0, 0, 0]);
  drawText(registro.resultado?.toString() || '', xResultado, yOhmResultado, resultadoColor);
  drawText(registro.pat1?.toString() || '', xPat1, yPat, [0, 0, 0]);
  drawText(registro.pat2?.toString() || '', xPat2, yPat, [0, 0, 0]);
  drawText(registro.pat3?.toString() || '', xPat3, yPat, [0, 0, 0]);
  drawText(registro.pat4?.toString() || '', xPat4, yPat, [0, 0, 0]);
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
    const imageBytes = base64ToArrayBuffer(base64.split(',')[1]);

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
  // Procesar las imágenes Base64 y dibujarlas en posiciones específicas
const images = [
  { base64: resultado.datosSpt2.imagen1, x: 150, y: height - 1260,  width: 150, height: 85 },
  { base64: resultado.datosSpt2.imagen2, x: 350, y: height - 1260,  width: 150, height: 85},
  { base64: resultado.datosSpt2.imagen3, x: 550, y: height - 1260, width: 150, height: 85 },
  { base64: resultado.datosSpt2.imagen4, x: 750, y: height - 1260,  width: 150, height: 85},
  { base64: resultado.metodoSelectivo[0]?.selectivo_esquema || '', x: 582, y: height - 870, width: 250, height: 185 },
  { base64: resultado.metodoCaida[0]?.caida_esquema || '', x: 582, y: height - 575, width: 250, height: 185 },
].filter(image => image.base64); // Filtrar solo imágenes con base64 válido

// Procesar y dibujar cada imagen
for (const image of images) {
  try {
    const mimeType = detectImageMimeType(image.base64);
    const imageBytes = base64ToUint8Array(image.base64);
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
    if (base64.startsWith('/9j')) {
    return 'image/jpeg';
    } else if (base64.startsWith('iVBORw')) {
    return 'image/png';
    } else {
    throw new Error('Formato de imagen no soportado.');
    }
    }

    // Función auxiliar: Convertir Base64 a Uint8Array
    function base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = atob(base64);
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
