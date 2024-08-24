/*import { Injectable } from '@angular/core';
import { PDFDocument, StandardFonts } from 'pdf-lib';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorPlanoService {

  private subestacionPDFMap: { [subestacion: string]: string[] } = {
    '1371-SS-102': ['1371-SS-102.pdf'],
    '1371-SS-103': ['1371-SS-103.pdf'],
    '1371-SS-104': ['1371-SS-104.pdf'],
    '1636-SS-101': ['1636-SS-101.pdf'],
    '2371-SS-201': ['2371-SS-201.pdf'],
    '2372-SS-202': ['2372-SS-202.pdf'],
    '2373-SS-203': ['2373-SS-203.pdf'],
    '2374-SS-204': ['2374-SS-204.pdf'],
    '2375-SS-205': ['2375-SS-205.pdf'],
    '3337-TX-309': ['3337-TX-309.pdf'],
    '3337-TX-310': ['3337-TX-310.pdf'],
    '3560-SS-300': ['3560-SS-300.pdf'],
    '3561-SS-301': ['3561-SS-301.pdf'],
    '3562-SS-302': ['3562-SS-302.pdf'],
    '3563-SS-303': ['3563-SS-303.pdf'],
    '3563-SS-307': ['3563-SS-307.pdf'],
    '3564-SS-308': ['3564-SS-308.pdf'],
    '3565-SS-305': ['3565-SS-305.pdf'],
    '3566-SS-306': ['3566-SS-306.pdf'],
    '4310-SS-407': ['4310-SS-407.pdf'],
    '4310-SS-409': ['4310-SS-409.pdf'],
    '4372-SS-402': ['4372-SS-402.pdf'],
    '4373-SS-403': ['4373-SS-403.pdf'],
    '4713-SS-400': ['4713-SS-400.pdf'],
    '5821-SS-501': ['5821-SS-501.pdf'],
    '5821-SS-502': ['5821-SS-502.pdf'],
    '6300-SS-101': ['6300-SS-101.pdf'],
    '6300-SS-201': ['6300-SS-201.pdf'],
    '6300-VILLA COLAB': ['6300-VILLA COLAB.pdf'],
    'SAB\'S CAMP': ['SAB\'S CAMP.pdf']
    // Agrega más mapeos para otras subestaciones si es necesario
  };


  constructor(private messageService: MessageService) { }

  async generarPDF(subestacion: string): Promise<void> {
    try {
      // Buscar la clave que contenga la subestación ingresada
      const nombresPDF = this.subestacionPDFMap[subestacion];
      if (!nombresPDF) {
        // Si no se encuentra el PDF, muestra un mensaje de error
        this.messageService.add({
          key: 'PdfGeneratorPlanoServiceerror',
          severity: 'error',
          summary: 'Error',
          detail: 'No se encontro un Plano'
        });
        console.error('No se encontró el nombre del PDF para la subestación:', subestacion);
        return;
      }

      // Abrir cada PDF asociado a la subestación en una nueva ventana
      for (const nombrePDF of nombresPDF) {
        // Cargar el contenido del PDF
        const path = `assets/pdf/subestaciones/${nombrePDF}`;
        const existingPdfBytes = await fetch(path).then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        // Modificar el PDF según sea necesario
        // Por ejemplo, agregar texto, imágenes, etc.
        const [newPage] = pdfDoc.getPages();
        const { width, height } = newPage.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const textSize = 8;

        // Guardar el PDF modificado
        const modifiedPdfBytes = await pdfDoc.save();

        // Crear una URL para abrir el PDF en una nueva ventana
        const modifiedPdfBlob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
        const modifiedPdfUrl = URL.createObjectURL(modifiedPdfBlob);

        // Abrir el PDF en una nueva ventana
        window.open(modifiedPdfUrl, '_blank');
      }

    } catch (error) {
      // Si ocurre un error al generar el PDF, muestra un mensaje de error
      this.messageService.add({
        key: 'PdfGeneratorPlanoServiceerror',
        severity: 'error',
        summary: 'Error',
        detail: 'No se encontro un Plano'
      });
      console.log('Error al generar el PDF:', error);
    }
  }

}*/
