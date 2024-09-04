
import { Injectable } from '@angular/core';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Subestacion } from '../interface/subestacion';
import { SubestacionService } from './subestacion.service';
import { Spt1Service } from './spt1.service';
import { UsuarioService } from './usuario.service';
@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorServicespt1Service {
  constructor(private Spt1Service: Spt1Service) {}

  async generarPDF(id_spt1: number): Promise<Blob> {
    try {
      const resultadosArray = await this.Spt1Service.buscarSpt1PorId(id_spt1).toPromise();
      if (!resultadosArray || resultadosArray.length === 0) {
        throw new Error(`No se encontraron resultados para el ID: ${id_spt1}`);
      }

      const resultados = resultadosArray[0];
      const existingPdfBytes = await fetch('assets/spt1.pdf').then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const [newPage] = pdfDoc.getPages();
      const { width, height } = newPage.getSize();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const textSize = 8;

      // Dibujar texto en el PDF
      newPage.drawText(resultados.ot, { font, size: textSize, x: 385, y: height - 110 });
      newPage.drawText(resultados.fecha, { font, size: textSize, x: 385, y: height - 130 });
      newPage.drawText(resultados.hora_inicio, { font, size: textSize, x: 785, y: height - 110 });
      newPage.drawText(resultados.hora_fin, { font, size: textSize, x: 785, y: height - 130 });

      // Función para dibujar cada valor en coordenadas específicas
      const drawValuesWithCoordinates = (values: string[], coordinates: { x: number; y: number }[]) => {
        values.forEach((value, index) => {
          if (coordinates[index]) {
            const { x, y } = coordinates[index];
            newPage.drawText(value, { font, size: textSize, x, y });
          }
        });
      };

      // Dibujar seguridad observaciones
      drawValuesWithCoordinates(resultados.seguridad_observaciones.split(',').map(item => item.trim()), [
        { x: 270, y: height - 210 },
        { x: 270, y: height - 225 },
        { x: 270, y: height - 240 },
        { x: 270, y: height - 255 },
        { x: 270, y: height - 270 }
      ]);

      // Dibujar barras equipotenciales
      drawValuesWithCoordinates(resultados.barras_equipotenciales.split(',').map(item => item.trim()), [
        { x: 300, y: height - 300 },
        { x: 300, y: height - 315 },
        { x: 300, y: height - 330 },
        { x: 300, y: height - 345 },
        { x: 300, y: height - 360 },
        // Agrega más coordenadas según sea necesario
      ]);

      // Dibujar pozos a tierra
      drawValuesWithCoordinates(resultados.pozos_a_tierra.split(',').map(item => item.trim()), [
        { x: 350, y: height - 400 },
        { x: 350, y: height - 415 },
        { x: 350, y: height - 430 },
        { x: 350, y: height - 445 },
        { x: 350, y: height - 460 },
        { x: 350, y: height - 475 }
      ]);

      // Dibujar cerco perimétrico
      drawValuesWithCoordinates(resultados.cerco_perimetrico.split(',').map(item => item.trim()), [
        { x: 400, y: height - 500 },
        { x: 400, y: height - 515 },
        { x: 400, y: height - 530 },
        { x: 400, y: height - 545 },
        { x: 400, y: height - 560 },
        { x: 400, y: height - 575 },
        { x: 400, y: height - 590 }
      ]);

      // Dibujar transformadores
      drawValuesWithCoordinates(resultados.transformadores.split(',').map(item => item.trim()), [
        { x: 450, y: height - 600 },
        { x: 450, y: height - 615 },
        { x: 450, y: height - 630 },
        { x: 450, y: height - 645 }
      ]);

      // Dibujar observaciones de aviso
      drawValuesWithCoordinates(resultados.observacion_aviso.split(',').map(item => item.trim()), [
        { x: 500, y: height - 660 },
        { x: 500, y: height - 675 },
        { x: 500, y: height - 690 }
      ]);

      // Guardar y devolver el PDF modificado
      const modifiedPdfBytes = await pdfDoc.save();
      return new Blob([modifiedPdfBytes], { type: 'application/pdf' });
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      throw error;
    }
  }


}

