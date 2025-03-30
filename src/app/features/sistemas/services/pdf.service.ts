/*
import { Injectable } from '@angular/core';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor() { }

  async createPdf(): Promise<Uint8Array> {
    // Crea un nuevo documento PDF
    const pdfDoc = await PDFDocument.create();

    // Agrega una página al documento
    const page = pdfDoc.addPage([600, 400]);

    // Agrega texto a la página
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    page.drawText('Hello, world!', {
      x: 50,
      y: 350,
      size: 30,
      font: timesRomanFont,
      color: rgb(0, 0, 0)
    });

    // Serializa el PDF a un array de bytes
    const pdfBytes = await pdfDoc.save();

    return pdfBytes;
  }
}
*/
