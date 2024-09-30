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



    async generarPDF(tagParam: string, otParam: string): Promise<Blob> {
      try {
        const [
          subestacion,
          resultadosArray,
          existingPdfBytes
        ] = await Promise.all([
          firstValueFrom(this.subestacionService.getSubestacionPorTag(tagParam)),
          firstValueFrom(this.spt2Service.buscarPorSubestacionyot(tagParam, otParam)),
          fetch('assets/spt2.pdf').then(res => res.arrayBuffer())
        ]);

        console.log('Resultado de subestacionService.getSubestacionPorTag:', subestacion);
        console.log('Resultado de spt2Service.buscarPorSubestacionyot:', resultadosArray);
        if (!resultadosArray || resultadosArray.length === 0) {
          console.error('No se encontraron resultados para el tag:', tagParam);
          throw new Error('No se encontraron resultados para el tag proporcionado'); // Lanzar un error
        }

       const resultados = resultadosArray[0];
        const [
          metodoCaidagrafica,
          metodoselectivografica,
          metodoCaidaArray,
          metodoSelectivoArray,
          reporteFotograficoArray,
          UsuarioService,
          UsuarioService1,
          metodoMedicion,

          yesImageBytes,

        ] = await Promise.all([

      firstValueFrom(this.MetodoCaidaGraficaService.buscarPorId(resultados.idgrafica_caida)),
      firstValueFrom(this.MetodoSelectivoGraficaService.buscarPorId(resultados.idgrafica_selectivo)),
      firstValueFrom(this.metodoCaidaService.getMetodoCaidaById(resultados.id_mcaida)),
      firstValueFrom(this.MetodoSelectivoService.getMetodoSelectivoById(resultados.id_mselectivo)),
      firstValueFrom(this.ReportefotograficoService.buscarReportePorId(resultados.idreportefoto)),
      firstValueFrom(this.UsuarioService.buscarUsuarioPorCorreo(resultados.lider)),
      firstValueFrom(this.UsuarioService.buscarUsuarioPorCorreo(resultados.supervisor)),
      firstValueFrom(this.MetodoMedicionService.buscarPorIdMetodoMedicion(resultados.id_metodomedicion)),
          fetch('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAQmSURBVGhD7ZpJKH1RGMDve2QKGYuFEqUMiRAroUQ2hg0bGTLtZGOplCVZSSyIFEWKMmaj2KGkZCNDLIwb8/j973f63vPOO/dNf+8O79//V1/efee7dX73nHPP8JhARvoHMNNfn8dnRTY3N6WpqSm6ksGu5Uvc3t5CY2MjmEwmiIyMhJubG/a9T4ksLi5CXFwcjmkWOTk5cHp6ysp8QuTh4QFaWlpYK6CA2WyGzs5O+Pj4oAwfENnf34eUlBRrK4SFhcHs7CyV/mBokbGxMQgKCrJKJCcnw+HhIZXyGFLk9fUV2tvbrQIYhYWFcH9/TxkihhO5vr5mlbaVqK+vh7e3N8pQxlAiR0dHkJSUZBXAwd3d3Q3f39+U4RjDiGxtbbF5wSKBb6aBgQEqdY0hRJaXlyEkJMQq4efnB8PDw1TqHrqLzMzMgL+/PycxOjpKpe6jq8jExIR1ksPA7uRpS1jQTcReAj8PDg5SqefoIjI9Pc1JYPT09FDp36G5CC78bMcEBq6j3HnFOkNTEXkPwS05MCoqKuDz85My/h7NRA4ODiA8PJyTyM7OhsfHR8r4HZqIXFxcQEJCAicRHx8P5+fnlPF7VBfBJ44bIFsJ7F7b29uU4R1UFfn6+oKamhpOAt9WIyMjlOE9VBXp7e3lJDAaGhqo1LuoJrK0tCTMFRkZGfD8/EwZ3kUVkePjY4iIiOAkQkNDHe7uvIHXRV5eXiA3N5eTwFBjXNjCiby/v7ONfVNTE9TW1rLPns64XV1dgkRVVdWvZ25XWEX29vYgMzNTqERHRwd7+7jDysoKW8Ha3h8bGwtXV1eUoR5MZH5+HgIDA7kK2EZfXx9Ldgae+NkenllC6ehGDZgIdqmFhQVITEwUKoKBi7ydnR12gxLYberq6oT7qqurKUN9uDGCJxjp6elChTDy8vIcdjFsUft8XFddXl5ShvpwIsjJyYnw6rQE7iPswbMmXDfZ5/b391OGNggiyOTkpFAxjNTUVGHJ3dbWJuSlpaVx57JaoCiCXaigoECoIMbc3BxlAVv42b+lcDZfW1ujDO1QFEFwE2RbQUvk5+ezwY1PPCsrSygvLS1Vfc5QwqEIUlxcLFQUnzi2BJ522JfhUc7u7i7drS1ORdbX14XKYhQVFUFMTIzwfWVlJd2pPU5FsIsodR+lwLGiV2sgTkWQ8fFxxYrbR3l5Od2hDy5FcP8QHR2tWHlL4LjZ2NigO/TB5c/TwcHBUnNzM10pI88vUklJCV3pg1u/s7e2tkryGKArEXlSlORWoSudoJZxCg56+Ykrdis8Ebm7u6NM/XCrRfBpy/sSuvpBXhhKQ0NDUlRUFH2jIyTkkqenJ24xWVZWBmdnZ1SqP26LIPKgh4CAAPaTmB7LEGd49G9Oq6urkryTlOSlC31jHP7/v5axkKQ/E5O9NqOelV4AAAAASUVORK5CYII=').then(res => res.arrayBuffer()), // Asegúrate de que esta ruta sea correcta
            // Asegúrate de que esta ruta sea correcta
        ]);

        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const [newPage] = pdfDoc.getPages();
        const { width, height } = newPage.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const textSize = 8;




        const drawText = (text: string, x: number, y: number, color: [number, number, number] = [0, 0, 0]) => {
          newPage.drawText(text, { font, size: textSize, x, y, color: rgb(color[0], color[1], color[2]) });
        };






        const determinarMensaje = (valor: number): { mensaje: string, color: [number, number, number] } => {
          if (valor > 25) return { mensaje: "NO CUMPLE", color: [1, 0, 0] }; // Rojo
          if (valor > 0) return { mensaje: "CUMPLE", color: [0, 1, 0] }; // Verde
          return { mensaje: "", color: [0, 0, 0] }; // Negro (o sin color, ya que no se dibujará)
        };
        // Valores y posiciones de los mensajes
        const mensajes = [
          { valor: parseFloat(resultados.pat1), y: height - 1015 },
          { valor: parseFloat(resultados.pat2), y: height - 1035 },
          { valor: parseFloat(resultados.pat3), y: height - 1052 },
          { valor: parseFloat(resultados.pat4), y: height - 1070 }
        ];

        // Dibujar los mensajes en el PDF
        mensajes.forEach(mensaje => {
          if (!isNaN(mensaje.valor) && mensaje.valor !== 0) {
            const { mensaje: text, color } = determinarMensaje(mensaje.valor);
            drawText(text, 350, mensaje.y, color);
          }
        });

        drawText(tagParam, 240, height - 215);
        if (subestacion) {
          drawText(subestacion.ubicacion, 385, height - 215);
          drawText(subestacion.plano, 240, height - 232);
          drawText(subestacion.fecha_plano, 795, height - 232);
          drawText(subestacion.versio.toString(), 935, height - 235);
        }

        drawText(resultados.ot, 520, height - 195);
        drawText(resultados.fecha, 740, height - 195);
        drawText(resultados.lider, 835, height - 195);
        drawText(resultados.supervisor, 795, height - 215);
        drawText(resultados.pat1 || '', 260, height - 1015);
        drawText(resultados.pat2 || '', 260, height - 1035);
        drawText(resultados.pat3 || '', 260, height - 1052);
        drawText(resultados.pat4 || '', 260, height - 1070);
        drawText(resultados.conclusiones, 130, height - 1105);

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

        const medicionTelurometro = await firstValueFrom(this.MedicionTelurometroService.buscarMedicionPorId(resultados.id_mtd_medicion_telurometro));
        if (medicionTelurometro) {
          drawText(medicionTelurometro.marca, 190, height -285);  // Ejemplo de uso de la marca
          drawText(medicionTelurometro.n_serie, 400,height - 285); // Ejemplo de uso del modelo
          drawText(medicionTelurometro.modelo, 655,height - 285); // Ejemplo de uso del número de serie
          drawText(medicionTelurometro.frecuencia, 800,height - 285);  // Ejemplo de uso de la marca
          drawText(medicionTelurometro.fecha_calibracion, 885,height - 265); // Ejemplo de uso del modelo
          drawText(medicionTelurometro.precision, 925,height - 285); // Ejemplo de uso del número de serie
        }


        console.log("metodoMedicion", metodoMedicion);
        if (metodoMedicion ) {
          await drawImageOrText(metodoMedicion.caidaPotencia, 640, height - 340);
          await drawImageOrText(metodoMedicion.selectivo, 729, height - 340);
          await drawImageOrText(metodoMedicion.sinPicas, 789, height - 340);
        }

        if (subestacion) {
          if (subestacion.cantidad_spt) {
            for (let i = 0; i < subestacion.cantidad_spt; i++) {
              drawText(`PAT ${i + 1}`, 195, height - (1015 + i * 18));

              // METODO CAIDA
              drawText(`PAT ${i + 1}`, 380 + i * 45, height - (405 + i * 0));
              drawText(`PAT ${i + 1}`, 135, height - (520 + i * 18));

              // METODO SELECTIVO
              drawText(`PAT ${i + 1}`, 380 + i * 45, height - (690 + i * 0));
              drawText(`PAT ${i + 1}`, 135, height - (815 + i * 18));
            }
          }
        }
        if (metodoCaidaArray) {
          metodoCaidaArray.forEach((metodoCaida, index) => {
            // Función para dibujar texto con color
            const drawText = (text: string, x: number, y: number, color: [number, number, number] = [0, 0, 0]) => {
              newPage.drawText(text, { font, size: textSize, x, y, color: rgb(color[0], color[1], color[2]) });
            };

            // Función para determinar mensaje y color
            const determinarMensajeCumplimiento = (resultado: string): { mensaje: string, color: [number, number, number] } => {
              if (resultado === "CUMPLE") return { mensaje: resultado, color: [0, 1, 0] }; // Verde para "CUMPLE"
              if (resultado === "NO CUMPLE") return { mensaje: resultado, color: [1, 0, 0] }; // Rojo para "NO CUMPLE"
              return { mensaje: resultado, color: [0, 0, 0] }; // Negro como predeterminado
            };

            const yPos = height - (615 + index * 0);
            const yPoss = height - (615 + index * 20);
            const xPos = 380 + index * 50;
            drawText(metodoCaida.r1mc?.toString(), xPos, yPos + 190);
            drawText(metodoCaida.r2mc?.toString(), xPos, yPos + 180);
            drawText(metodoCaida.r3mc?.toString(), xPos, yPos + 170);
            if (+metodoCaida.valormc !== 0) drawText(metodoCaida.valormc?.toString(), 200, yPoss + 93);
            const resultadoMetodoCaida = determinarMensajeCumplimiento(metodoCaida.resultadomc);
            drawText(resultadoMetodoCaida.mensaje, 290, yPoss + 93, resultadoMetodoCaida.color);
            //drawText(metodoCaida.conclusionesmc, 125, yPoss + 60);
          });
        }



        if (metodoSelectivoArray) {
          metodoSelectivoArray.forEach((metodoSelectivo, index) => {

             // Función para dibujar texto con color
             const drawText = (text: string, x: number, y: number, color: [number, number, number] = [0, 0, 0]) => {
              newPage.drawText(text, { font, size: textSize, x, y, color: rgb(color[0], color[1], color[2]) });
            };

            // Función para determinar mensaje y color
            const determinarMensajeCumplimiento = (resultado: string): { mensaje: string, color: [number, number, number] } => {
              if (resultado === "CUMPLE") return { mensaje: resultado, color: [0, 1, 0] }; // Verde para "CUMPLE"
              if (resultado === "NO CUMPLE") return { mensaje: resultado, color: [1, 0, 0] }; // Rojo para "NO CUMPLE"
              return { mensaje: resultado, color: [0, 0, 0] }; // Negro como predeterminado
            };

            const yPos = height - (900 + index * 0);
            const yPoss = height - (900 + index * 20);
            const xPos = 380 + index * 50;
            drawText(metodoSelectivo.r1ms?.toString(), xPos, yPos + 195);
            drawText(metodoSelectivo.r2ms?.toString(), xPos, yPos + 180);
            drawText(metodoSelectivo.r3ms?.toString(), xPos, yPos + 165);
            if (+metodoSelectivo.valorms !== 0) drawText(metodoSelectivo.valorms?.toString(), 200, yPoss + 85);

            const resultadoSelectivo = determinarMensajeCumplimiento(metodoSelectivo.resultadoms);
            drawText(resultadoSelectivo.mensaje, 290, yPoss +85, resultadoSelectivo.color);

            //drawText(metodoSelectivo.conclusionesms, 125, yPoss + 50);
          });
        }



        if (reporteFotograficoArray && reporteFotograficoArray.length > 0) {
          const reporteFoto = reporteFotograficoArray[0];
          let imageX = 140; // Posición inicial en X
          const imageY = height - 1250; // Posición fija en Y
          const imageWidth = 100;
          const imageHeight = 100;

          // Array de imágenes
          const imagenes = [reporteFoto.imagen1, reporteFoto.imagen2, reporteFoto.imagen3, reporteFoto.imagen4];

          for (const imagenBase64 of imagenes) {
            if (imagenBase64) {
              try {
                const base64Header = typeof imagenBase64 === 'string' ? imagenBase64.match(/^data:image\/([a-zA-Z]+);base64,/) : null;
                let cleanedBase64 = typeof imagenBase64 === 'string' ? imagenBase64.replace(/^data:image\/[a-z]+;base64,/, '').replace(/[^A-Za-z0-9+/=]/g, '') : '';

                if (/^[A-Za-z0-9+/=]*$/.test(cleanedBase64)) {
                  const reporteFotoBytes = this.base64ToArrayBuffer(cleanedBase64);

                  let reporteFotoImage;
                  if (base64Header && base64Header[1] === 'jpeg') {
                    reporteFotoImage = await pdfDoc.embedJpg(reporteFotoBytes);
                  } else if (base64Header && base64Header[1] === 'png') {
                    reporteFotoImage = await pdfDoc.embedPng(reporteFotoBytes);
                  } else {
                    throw new Error('Formato de imagen no soportado. Solo se permiten JPEG y PNG.');
                  }

                  newPage.drawImage(reporteFotoImage, {
                    x: imageX,
                    y: imageY,
                    width: imageWidth,
                    height: imageHeight,
                  });

                  // Ajustar la posición X para la próxima imagen
                  imageX += imageWidth + 20; // Espacio entre imágenes
                } else {
                  console.error("La cadena Base64 contiene caracteres inválidos.");
                }
              } catch (error) {
                console.error("Error completo al generar la imagen desde Base64:", error);
                console.error("Error al generar la imagen desde Base64:", error instanceof Error ? error.message : "Error desconocido");
              }
            }
          }
        } else {
          console.error('No se encontró reporte fotográfico.');
        }


        const embedGrafica = async (graficaData: string, x: number, y: number, w: number, h: number) => {
          if (!graficaData) return;
          const match = graficaData.match(/^data:(image\/[a-z]+);base64,(.*)$/);
          if (!match) throw new Error("Formato de imagen no reconocido.");
          const [, imageFormat, base64Data] = match;
          const graficaBytes = this.base64ToArrayBuffer(base64Data);

          let graficaImage;
          if (imageFormat === 'image/jpeg') graficaImage = await pdfDoc.embedJpg(graficaBytes);
          else if (imageFormat === 'image/png') graficaImage = await pdfDoc.embedPng(graficaBytes);
          else throw new Error(`Formato de imagen no soportado: ${imageFormat}`);

          newPage.drawImage(graficaImage, { x, y, width: w, height: h });
        };

        if (metodoCaidagrafica && metodoCaidagrafica.length > 0) {
          await embedGrafica(metodoCaidagrafica[0].grafica, 583, 860, 250, 170);
        }

        if (metodoselectivografica && metodoselectivografica.length > 0) {
          await embedGrafica(metodoselectivografica[0].grafica, 583, 580, 240, 170);
        }

        const embedFirma = async (firmaData: string, x: number, y: number, w: number, h: number) => {
          if (!firmaData) return;
          const match = firmaData.match(/^data:(image\/[a-z]+);base64,(.*)$/);
          if (!match) throw new Error("Formato de firma no reconocido.");
          const [, imageFormat, base64Data] = match;
          const firmaBytes = this.base64ToArrayBuffer(base64Data);

          let firmaImage;
          if (imageFormat === 'image/jpeg') firmaImage = await pdfDoc.embedJpg(firmaBytes);
          else if (imageFormat === 'image/png') firmaImage = await pdfDoc.embedPng(firmaBytes);
          else throw new Error(`Formato de imagen no soportado: ${imageFormat}`);

          newPage.drawImage(firmaImage, { x, y, width: w, height: h });
        };

        if (UsuarioService) {
          if (UsuarioService.firma) {
            drawText(UsuarioService.usuario, 262, height - 1290);
            drawText(UsuarioService.fotocheck.toString(), 640, height - 1290);
            await embedFirma(UsuarioService.firma, 810, 165, 80, 30);
          }
        }

        if (UsuarioService1) {
          if (UsuarioService1.firma) {
            drawText(UsuarioService1.usuario, 262, height - 1323);
            drawText(UsuarioService1.fotocheck.toString(), 640, height - 1323);
            if (resultados.firma === true) await embedFirma(UsuarioService1.firma, 810, 129, 80, 30);
          }
        }



          const modifiedPdfBytes = await pdfDoc.save();
          const modifiedPdfBlob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });

          // Mensaje de éxito en la consola
          console.log('El PDF se generó de manera correcta.');

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

