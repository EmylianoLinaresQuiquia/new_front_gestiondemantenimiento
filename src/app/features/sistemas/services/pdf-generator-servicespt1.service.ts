
import { Injectable } from '@angular/core';
import { PDFDocument, rgb ,PDFPage, PDFFont, PDFImage, StandardFonts } from 'pdf-lib';
import { Subestacion } from '../interface/subestacion';
import { SubestacionService } from './subestacion.service';
import { Spt1Service } from './spt1.service';
import { UsuarioService } from './usuario.service';
import { BuscarPorId } from '../interface/spt1';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorServicespt1Service {
  constructor(private Spt1Service: Spt1Service) {}

  processValues<T>(data: T): T {
    console.log('Procesando valores:', data);
    return data;
}

processJsonArray(jsonString: string): any[] {
    try {
        return JSON.parse(jsonString || '[]');
    } catch (error) {
        console.error('Error al procesar JSON:', error);
        return [];
    }
}

async generarPDF(id_spt1: number): Promise<Blob> {
  try {
    // Obtener resultados desde el servicio
    const resultadosArray: BuscarPorId[] = (await this.Spt1Service.buscarSpt1PorId(id_spt1).toPromise()) ?? [];
    if (resultadosArray.length === 0) {
      throw new Error(`No se encontraron resultados para el ID: ${id_spt1}`);
    }

    const resultados = resultadosArray[0];

    // Cargar el PDF base
    const existingPdfBytes = await fetch('assets/spt1.pdf').then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const page = pdfDoc.getPages()[0];
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const textSize = 8;

    // Dibujar datos en el PDF
    this.drawFixedText(page, font, textSize, height, resultados);
    this.drawDynamicData(page, font, textSize, height, resultados);
    await this.drawSignatures(pdfDoc, page, resultados);
    this.drawSecurityObservations(page, font, textSize, height, resultados);
    this.drawIndicatorImages(pdfDoc, page, height, resultados);

    // Guardar y devolver el PDF modificado
    const modifiedPdfBytes = await pdfDoc.save();
    const modifiedPdfBlob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });

    // Abrir en una nueva pestaña y liberar URL
    const blobUrl = URL.createObjectURL(modifiedPdfBlob);
    window.open(blobUrl, '_blank');
    URL.revokeObjectURL(blobUrl);

    return modifiedPdfBlob;
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    throw error;
  }
}

// Dibujar texto fijo
private drawFixedText(page: PDFPage, font: PDFFont, size: number, height: number, resultados: BuscarPorId): void {
  const fixedData = [
    { text: resultados.ot, x: 385, y: height - 110 },
    { text: resultados.fecha, x: 385, y: height - 130 },
    { text: resultados.hora_inicio, x: 785, y: height - 110 },
    { text: resultados.hora_fin, x: 785, y: height - 130 },
    { text: resultados.tag_subestacion, x: 225, y: height - 110 },
    { text: resultados.ubicacion, x: 155, y: height - 130 },
    { text: resultados.cantidad_spt, x: 275, y: height - 395 },
    { text: resultados.plano, x: 525, y: height - 395 },
    { text: resultados.lider, x: 515, y: height - 110 },
    { text: resultados.supervisor, x: 515, y: height - 130 },
    { text: resultados.lider, x: 175, y: height - 1210 },
    { text: resultados.supervisor, x: 455, y: height - 1210 },
    { text: resultados.fotocheck_lider, x: 175, y: height - 1225 },
    { text: resultados.fotocheck_supervisor, x: 455, y: height - 1225 }
  ];

  this.drawTextArray(page, font, size, fixedData);
}

// Dibujar texto dinámico
private drawDynamicData(page: PDFPage, font: PDFFont, size: number, height: number, resultados: BuscarPorId): void {
  const dynamicMapping = [
    { data: resultados.pozos_a_tierra, type: 'pozos' },
    { data: resultados.barras_equipotenciales, type: 'barras' },
    { data: resultados.cerco_perimetrico, type: 'cerco' },
    { data: resultados.transformadores, type: 'transformadores' },
    { data: resultados.observacion_aviso, type: 'avisoLeft' },
    { data: resultados.aviso, type: 'avisoRight' }
  ];

  dynamicMapping.forEach(({ data, type }) => {
    const coordinates = this.getCoordinates(type, height);
    const dataArray = typeof data === 'string' ? data.split(',') : data; // Asegura que sea un array
    this.drawTextArray(
      page,
      font,
      size,
      dataArray.map((text: string, i: number) => ({ text: text.trim(), ...coordinates[i] }))
    );
  });

}

// Dibujar observaciones de seguridad
private drawSecurityObservations(page: PDFPage, font: PDFFont, size: number, height: number, resultados: BuscarPorId): void {
  const observations = resultados.seguridad_observaciones?.split(',').map(obs => obs.trim()) || [];
  const coordinates = Array.from({ length: 5 }, (_, i) => ({ x: 510, y: height - 270 - (12 * i) }));
  this.drawTextArray(page, font, size, observations.map((text, i) => ({ text, ...coordinates[i] })));
}

// Dibujar imágenes de indicadores
private async drawIndicatorImages(pdfDoc: PDFDocument, page: PDFPage, height: number, resultados: BuscarPorId): Promise<void> {
  const buenoCoords = this.getCoordinates('bueno', height);
  const naCoords = this.getCoordinates('na', height);
  const imageBytes = this.base64ToArrayBuffer('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAQmSURBVGhD7ZpJKH1RGMDve2QKGYuFEqUMiRAroUQ2hg0bGTLtZGOplCVZSSyIFEWKMmaj2KGkZCNDLIwb8/j973f63vPOO/dNf+8O79//V1/efee7dX73nHPP8JhARvoHMNNfn8dnRTY3N6WpqSm6ksGu5Uvc3t5CY2MjmEwmiIyMhJubG/a9T4ksLi5CXFwcjmkWOTk5cHp6ysp8QuTh4QFaWlpYK6CA2WyGzs5O+Pj4oAwfENnf34eUlBRrK4SFhcHs7CyV/mBokbGxMQgKCrJKJCcnw+HhIZXyGFLk9fUV2tvbrQIYhYWFcH9/TxkihhO5vr5mlbaVqK+vh7e3N8pQxlAiR0dHkJSUZBXAwd3d3Q3f39+U4RjDiGxtbbF5wSKBb6aBgQEqdY0hRJaXlyEkJMQq4efnB8PDw1TqHrqLzMzMgL+/PycxOjpKpe6jq8jExIR1ksPA7uRpS1jQTcReAj8PDg5SqefoIjI9Pc1JYPT09FDp36G5CC78bMcEBq6j3HnFOkNTEXkPwS05MCoqKuDz85My/h7NRA4ODiA8PJyTyM7OhsfHR8r4HZqIXFxcQEJCAicRHx8P5+fnlPF7VBfBJ44bIFsJ7F7b29uU4R1UFfn6+oKamhpOAt9WIyMjlOE9VBXp7e3lJDAaGhqo1LuoJrK0tCTMFRkZGfD8/EwZ3kUVkePjY4iIiOAkQkNDHe7uvIHXRV5eXiA3N5eTwFBjXNjCiby/v7ONfVNTE9TW1rLPns64XV1dgkRVVdWvZ25XWEX29vYgMzNTqERHRwd7+7jDysoKW8Ha3h8bGwtXV1eUoR5MZH5+HgIDA7kK2EZfXx9Ldgae+NkenllC6ehGDZgIdqmFhQVITEwUKoKBi7ydnR12gxLYberq6oT7qqurKUN9uDGCJxjp6elChTDy8vIcdjFsUft8XFddXl5ShvpwIsjJyYnw6rQE7iPswbMmXDfZ5/b391OGNggiyOTkpFAxjNTUVGHJ3dbWJuSlpaVx57JaoCiCXaigoECoIMbc3BxlAVv42b+lcDZfW1ujDO1QFEFwE2RbQUvk5+ezwY1PPCsrSygvLS1Vfc5QwqEIUlxcLFQUnzi2BJ522JfhUc7u7i7drS1ORdbX14XKYhQVFUFMTIzwfWVlJd2pPU5FsIsodR+lwLGiV2sgTkWQ8fFxxYrbR3l5Od2hDy5FcP8QHR2tWHlL4LjZ2NigO/TB5c/TwcHBUnNzM10pI88vUklJCV3pg1u/s7e2tkryGKArEXlSlORWoSudoJZxCg56+Ykrdis8Ebm7u6NM/XCrRfBpy/sSuvpBXhhKQ0NDUlRUFH2jIyTkkqenJ24xWVZWBmdnZ1SqP26LIPKgh4CAAPaTmB7LEGd49G9Oq6urkryTlOSlC31jHP7/v5axkKQ/E5O9NqOelV4AAAAASUVORK5CYII=');
  const image = await pdfDoc.embedPng(imageBytes);

  this.drawImagesForValues(resultados.bueno.split(','), buenoCoords, page, image);
  this.drawImagesForValues(resultados.na.split(','), naCoords, page, image);
}

// Dibujar firmas
private async drawSignatures(pdfDoc: PDFDocument, page: PDFPage, resultados: BuscarPorId): Promise<void> {
  if (resultados.firma_lider) {
    await this.embedSignature(pdfDoc, page, resultados.firma_lider, { x: 175, y: 20, width: 50, height: 25 });
  }
  if (resultados.firma_supervisor) {
    await this.embedSignature(pdfDoc, page, resultados.firma_supervisor, { x: 455, y: 20, width: 50, height: 25 });
  }
}

// Función genérica para dibujar texto
private drawTextArray(page: PDFPage, font: PDFFont, size: number, data: { text: string, x: number, y: number }[]): void {
  data.forEach(({ text, x, y }) => page.drawText(text, { font, size, x, y }));
}

// Coordenadas dinámicas
private getCoordinates(type: string, height: number): { x: number, y: number }[] {
  const coordinatesMap : Record<string, { x: number; y: number }[]> = {
    pozos: [
      { x: 100, y: height - 200 },
      { x: 100, y: height - 220 },
    ],
    barras: [
      { x: 200, y: height - 200 },
      { x: 200, y: height - 220 },
    ],
    cerco: [
      { x: 300, y: height - 200 },
      { x: 300, y: height - 220 },
    ],
    transformadores: [
      { x: 400, y: height - 200 },
      { x: 400, y: height - 220 },
    ],
    avisoLeft: [
      { x: 500, y: height - 200 },
      { x: 500, y: height - 220 },
    ],
    avisoRight: [
      { x: 600, y: height - 200 },
      { x: 600, y: height - 220 },
    ],
  };
  return coordinatesMap[type] || [];
}


// Convertir base64 a ArrayBuffer
private base64ToArrayBuffer(base64: string): ArrayBuffer {
  return Uint8Array.from(atob(base64), c => c.charCodeAt(0)).buffer;
}

// Incrustar firma
private async embedSignature(pdfDoc: PDFDocument, page: PDFPage, signatureData: string, coords: { x: number, y: number, width: number, height: number }): Promise<void> {
  const match = signatureData.match(/^data:(image\/[a-z]+);base64,(.*)$/);
  if (!match) throw new Error('Formato de firma inválido.');
  const [, format, base64] = match;
  const bytes = this.base64ToArrayBuffer(base64);

  const image = format.includes('jpeg') ? await pdfDoc.embedJpg(bytes) : await pdfDoc.embedPng(bytes);
  page.drawImage(image, coords);
}

// Dibujar imágenes según coordenadas
private drawImagesForValues(values: string[], coords: { x: number, y: number }[], page: PDFPage, image: PDFImage): void {
  values.forEach((value, i) => {
    if (value.trim()) {
      page.drawImage(image, { ...coords[i], width: 10, height: 10 });
    }
  });
}
}


   /*private drawValuesWithCoordinates(values: string[], coordinates: { x: number, y: number }[], page: any, font: any, textSize: number) {
    values.forEach((value, index) => {
      let color;

      // Asignar color según el valor
      if (value === 'Buen Estado') {
        color = rgb(0, 1, 0); // Verde
      } else if (value === 'No aplica') {
        color = rgb(0, 0, 0); // Negro
      } else {
        color = rgb(1, 0, 0); // Rojo
      }

      // Dibuja el texto en la coordenada correspondiente con el color
      page.drawText(value, {
        x: coordinates[index].x,
        y: coordinates[index].y,
        size: textSize,
        font: font,
        color: color,
      });
    });
  }*/




