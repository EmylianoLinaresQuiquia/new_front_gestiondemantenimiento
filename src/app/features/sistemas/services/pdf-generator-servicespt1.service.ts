/*import { Injectable } from '@angular/core';
import { SubestacionService } from './subestacion.service';
import { Spt1Service } from './spt1.service';
import { Subestacion } from '../interface/subestacion';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

import { BarraequiAiService } from './barraequi-ai.service';
import { BarraequiNoAiService } from './barraequi-no-ai.service';
import { CercopAiService } from './cercop-ai.service';
import { CercopNoAiService } from './cercop-no-ai.service';
import { TransformadorNoAiService } from './transformador-no-ai.service';
import { TipostpService } from './tipostp.service';
import { RecomendacionService } from './recomendacion.service';
import { SeguridadobservacionService } from './seguridadobservacion.service';
import { UsuarioService } from './usuario.service';
import { Pat1spt1 } from '../interface/pat1spt1';
import { Pat1spt1Service } from './pat1spt1.service';
import { Pat2spt1 } from '../interface/pat2spt1';
import { Pat2spt1Service } from './pat2spt1.service';
import { Pat3spt1 } from '../interface/pat3spt1';
import { Pat3spt1Service } from './pat3spt1.service';
import { Pat4spt1 } from '../interface/pat4spt1';
import { Pat4spt1Service } from './pat4spt1.service';
import { saveAs } from 'file-saver';*/
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
  constructor(
    private Spt1Service: Spt1Service,

    ) {

    }

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

        newPage.drawText(resultados.ot, { font, size: textSize, x: 270, y: height - 150 });

        const modifiedPdfBytes = await pdfDoc.save();
        return new Blob([modifiedPdfBytes], { type: 'application/pdf' });
      } catch (error) {
        console.error('Error al generar el PDF:', error);
        throw error; // Asegura que se lanza un error en lugar de devolver undefined
      }
    }


}

