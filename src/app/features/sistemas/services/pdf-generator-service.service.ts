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
        const resultados = await firstValueFrom(this.spt2Service.obtenerSpt2PorId(id));

        // Verificar si es un array y tiene al menos un elemento
        if (!resultados || resultados.length === 0) {
          console.error('No se encontraron resultados para el ID:', id);
          throw new Error('No se encontraron resultados para el ID proporcionado');
        }

        const resultado = resultados[0];  // Acceder al primer elemento del array
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
        drawText(resultado.ot || '', 520, height - 195);
        drawText(resultado.fecha || '', 740, height - 195);
        drawText(resultado.usuario1_usuario || '', 835, height - 195);
        drawText(resultado.usuario2_usuario, 795, height - 215);
        //drawText(resultado.usuario1_firma || '', 795, height - 232);
        drawText(resultado.ubicacion || '', 385, height - 215);
        drawText(resultado.plano || '', 240, height - 232);
        drawText(resultado.fecha_plano || '', 795, height - 232);
        drawText(resultado.subestacion_versio?.toString() || '', 935, height - 235);

        drawText(resultado.pat1 || '', 260, height - 1015);
        drawText(resultado.pat2 || '', 260, height - 1035);
        drawText(resultado.pat3 || '', 260, height - 1052);
        drawText(resultado.pat4 || '', 260, height - 1070);
        drawText(resultado.sujecion_conclusiones || '', 130, height - 1105);


        const determinarMensaje = (valor: number): { mensaje: string, color: [number, number, number] } => {
          if (valor > 25) return { mensaje: "NO CUMPLE", color: [1, 0, 0] }; // Rojo
          if (valor > 0) return { mensaje: "CUMPLE", color: [0, 1, 0] }; // Verde
          return { mensaje: "", color: [0, 0, 0] }; // Negro (o sin color, ya que no se dibujará)
        };

        //drawText(tagParam, 240, height - 215);


        drawText(resultado.usuario1_fotocheck?.toString(), 640, height - 1290);
        drawText(resultado.usuario2_fotocheck?.toString(), 640, height - 1323);

        drawText(resultado.usuario1_usuario , 262, height - 1290);
        drawText(resultado.usuario2_usuario , 262, height - 1323);


        drawText(resultado.selectivo_conclusiones , 130, height - 905);
        drawText(resultado.caida_conclusiones , 130, height - 610);



              drawText(resultado.marca, 190, height - 285);
              drawText(resultado.n_serie, 400, height - 285);
              drawText(resultado.modelo, 655, height - 285);
              drawText(resultado.frecuencia, 800, height - 285);
              drawText(resultado.fecha_calibracion, 885, height - 265);
              drawText(resultado.precision, 925, height - 285);

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

                await drawImageOrText(resultado.caida_potencia, 640, height - 340);
                await drawImageOrText(resultado.selectivo, 729, height - 340);
                await drawImageOrText(resultado.sin_picas, 789, height - 340);


        const modifiedPdfBytes = await pdfDoc.save();
        const modifiedPdfBlob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });

        console.log('El PDF se generó de manera correcta.');
        const blobUrl = URL.createObjectURL(modifiedPdfBlob);
        window.open(blobUrl, '_blank');

        return modifiedPdfBlob;

      } catch (error) {
        console.error('Error al generar el PDF:', error);
        throw error;
      }
    }
      private base64ToArrayBuffer(base64: string): Uint8Array {
        try {
          const binaryString = atob(base64);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          return bytes;
        } catch (error) {
          console.error("Error al decodificar base64:", error, base64);
          throw error;
        }
      }


}

