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
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorServicespt1Service {

  //private reporteFotografico: Reportefotografico[] = [];

  constructor(private subestacionService: SubestacionService,
    private Spt1Service: Spt1Service,
    private UsuarioService :UsuarioService,
    private SeguridadobservacionService:SeguridadobservacionService,

    private BarraequiNoAiService:BarraequiNoAiService,
    private BarraequiAiService:BarraequiAiService,
    private CercopNoAiService:CercopNoAiService,
    private CercopAiService:CercopAiService,
    private TransformadorNoAiService:TransformadorNoAiService,
    private RecomendacionService :RecomendacionService,
    private TipostpService:TipostpService,
    private Pat1spt1Service:Pat1spt1Service,private Pat2spt2Service:Pat2spt1Service,private Pat3spt1Service:Pat3spt1Service,private Pat4spt1Service:Pat4spt1Service
    ) {

    }

    async generarPDF(tagParam: string, otParam: string): Promise<void> {

      try {
        const subestacion = await this.subestacionService.getSubestacionPorTag(tagParam).toPromise() as Subestacion;
        console.log('Datos de subestación:', subestacion);

        const resultadosArray = await this.Spt1Service.buscarPorTagSubestacionYOt(tagParam, otParam).toPromise();
        if (!resultadosArray || resultadosArray.length === 0) {
          console.error('No se encontraron resultados para el tag:', tagParam);
          return;
        }
        const resultados = resultadosArray[0];
        const UsuarioService = await this.UsuarioService.buscarUsuarioPorCorreo(resultados.lider).toPromise();
        const UsuarioService1= await this.UsuarioService.buscarUsuarioPorCorreo(resultados.supervisor).toPromise();
        const seguridadobservacion = await this.SeguridadobservacionService.buscarPorLoteId(resultados.lote_id).toPromise();
        const pat1spt1 =await this.Pat1spt1Service.buscarPorIdtablaPat1Spt1(resultados.pat1Spt1Id).toPromise()
        const pat2spt1 =await this.Pat2spt2Service.buscarPorIdtablaPat2Spt1(resultados.pat2Spt1Id).toPromise()
        const pat3spt1 =await this.Pat3spt1Service.buscarPorIdtablaPat3Spt1(resultados.pat3Spt1Id).toPromise()
        const pat4spt1 =await this.Pat4spt1Service.buscarPorIdtablaPat4Spt1(resultados.pat4Spt1Id).toPromise()
        const barra_e_Ai = await this.BarraequiAiService.buscarBarraEquipotencialAiPorLoteID(resultados.barra_e_Ai_lote_id).toPromise();
        const barra_e_noAi = await this.BarraequiNoAiService.buscarBarraEquipotencialPorLoteID(resultados.barra_e_noAi_lote_id).toPromise();
        const cerco_p_Ai = await this.CercopAiService.buscarCercoPerimetricoAiPorLoteID(resultados.cerco_p_Ai_lote_id).toPromise();
        const cerco_p_noAi = await this.CercopNoAiService.buscarCercoPerimetricoNoAiPorLoteID(resultados.cerco_p_noAi_lote_id).toPromise();
        const transformador_noAi = await this.TransformadorNoAiService.buscarTransformadorNoAiPorLoteID(resultados.transformador_noAi_lote_id).toPromise();
        const recomendacion = await this.RecomendacionService.buscarRecomendacionPorLote(resultados.recomendacion_lote_id).toPromise();
        const tipostp = await this.TipostpService.buscarPorIdTipoSpt(resultados.id_tipostp).toPromise();
        console.log("Seguridad Observación:", seguridadobservacion);

        const existingPdfBytes = await fetch('assets/pdf/spt1.pdf').then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const [newPage] = pdfDoc.getPages();
        const { width, height } = newPage.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const textSize = 8;
        const redColor = rgb(1, 0, 0); // Rojo
        const greenColor = rgb(0, 0.4, 0); // Verde
        newPage.drawText(tagParam, { font, size: textSize, x: 210, y: height - 110 });
        newPage.drawText(subestacion.ubicacion, { font, size: textSize, x: 140, y: height - 130 });
        newPage.drawText(subestacion.cantidad_spt.toString(), { font, size: textSize, x: 270, y: height - 395 });

        if (subestacion.cantidad_spt) {
            const startX = 150; // Posición x inicial
            const yPosition = height - 450; // Posición y constante para la fila
            const spacingX = 180; // Espaciado horizontal entre los textos
            for (let i = 0; i < subestacion.cantidad_spt; i++) {
                let xPos = startX + i * spacingX;
                newPage.drawText(`PAT ${i + 1}`, { font, size: textSize, x: xPos, y: yPosition });
            }
        }

        newPage.drawText(subestacion.plano, { font, size: textSize, x: 580, y: height - 395 });
        newPage.drawText(resultados.ot, { font, size: textSize, x: 385, y: height - 110 });
        newPage.drawText(resultados.fecha, { font, size: textSize, x: 385, y: height - 130 });
        newPage.drawText(resultados.lider, { font, size: textSize, x: 558, y: height - 110 });
        newPage.drawText(resultados.supervisor, { font, size: textSize, x: 558, y: height - 130 });
        newPage.drawText(resultados.inicio, { font, size: textSize, x: 785, y: height - 110 });
        newPage.drawText(resultados.fin, { font, size: textSize, x: 785, y: height - 130 });

        const checkmarkImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAQmSURBVGhD7ZpJKH1RGMDve2QKGYuFEqUMiRAroUQ2hg0bGTLtZGOplCVZSSyIFEWKMmaj2KGkZCNDLIwb8/j973f63vPOO/dNf+8O79//V1/efee7dX73nHPP8JhARvoHMNNfn8dnRTY3N6WpqSm6ksGu5Uvc3t5CY2MjmEwmiIyMhJubG/a9T4ksLi5CXFwcjmkWOTk5cHp6ysp8QuTh4QFaWlpYK6CA2WyGzs5O+Pj4oAwfENnf34eUlBRrK4SFhcHs7CyV/mBokbGxMQgKCrJKJCcnw+HhIZXyGFLk9fUV2tvbrQIYhYWFcH9/TxkihhO5vr5mlbaVqK+vh7e3N8pQxlAiR0dHkJSUZBXAwd3d3Q3f39+U4RjDiGxtbbF5wSKBb6aBgQEqdY0hRJaXlyEkJMQq4efnB8PDw1TqHrqLzMzMgL+/PycxOjpKpe6jq8jExIR1ksPA7uRpS1jQTcReAj8PDg5SqefoIjI9Pc1JYPT09FDp36G5CC78bMcEBq6j3HnFOkNTEXkPwS05MCoqKuDz85My/h7NRA4ODiA8PJyTyM7OhsfHR8r4HZqIXFxcQEJCAicRHx8P5+fnlPF7VBfBJ44bIFsJ7F7b29uU4R1UFfn6+oKamhpOAt9WIyMjlOE9VBXp7e3lJDAaGhqo1LuoJrK0tCTMFRkZGfD8/EwZ3kUVkePjY4iIiOAkQkNDHe7uvIHXRV5eXiA3N5eTwFBjXNjCiby/v7ONfVNTE9TW1rLPns64XV1dgkRVVdWvZ25XWEX29vYgMzNTqERHRwd7+7jDysoKW8Ha3h8bGwtXV1eUoR5MZH5+HgIDA7kK2EZfXx9Ldgae+NkenllC6ehGDZgIdqmFhQVITEwUKoKBi7ydnR12gxLYberq6oT7qqurKUN9uDGCJxjp6elChTDy8vIcdjFsUft8XFddXl5ShvpwIsjJyYnw6rQE7iPswbMmXDfZ5/b391OGNggiyOTkpFAxjNTUVGHJ3dbWJuSlpaVx57JaoCiCXaigoECoIMbc3BxlAVv42b+lcDZfW1ujDO1QFEFwE2RbQUvk5+ezwY1PPCsrSygvLS1Vfc5QwqEIUlxcLFQUnzi2BJ522JfhUc7u7i7drS1ORdbX14XKYhQVFUFMTIzwfWVlJd2pPU5FsIsodR+lwLGiV2sgTkWQ8fFxxYrbR3l5Od2hDy5FcP8QHR2tWHlL4LjZ2NigO/TB5c/TwcHBUnNzM10pI88vUklJCV3pg1u/s7e2tkryGKArEXlSlORWoSudoJZxCg56+Ykrdis8Ebm7u6NM/XCrRfBpy/sSuvpBXhhKQ0NDUlRUFH2jIyTkkqenJ24xWVZWBmdnZ1SqP26LIPKgh4CAAPaTmB7LEGd49G9Oq6urkryTlOSlC31jHP7/v5axkKQ/E5O9NqOelV4AAAAASUVORK5CYII=';  // Tu imagen base64 completa para 'bueno'
        const xMarkText = 'X'; // Texto para representar 'malo'
        const drawCheckOrX = async (value: string, x: number, y: number): Promise<void> => {
          if (value === 'bueno') {
            const imageBytes = base64ToArrayBuffer(checkmarkImageBase64.split(',')[1]);
            const checkmarkImage = await pdfDoc.embedPng(imageBytes);
            newPage.drawImage(checkmarkImage, {
              x: x,
              y: y,
              width: 6, // Ajusta según sea necesario
              height: 5 // Ajusta según sea necesario
            });
          } else if (value === 'malo') {
            newPage.drawText(xMarkText, { font, size: textSize, x: x, y: y });
          }
        };

        function base64ToArrayBuffer(base64: string): ArrayBuffer {
          try {
              // Verifica si la entrada es una cadena válida
              if (!base64) {
                  throw new Error("La entrada no es una cadena base64 válida.");
              }

              const binaryString = window.atob(base64); // Decodifica la cadena base64 a una cadena binaria
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                  bytes[i] = binaryString.charCodeAt(i);
              }
              return bytes.buffer;
          } catch (error) {
              // Registra el error con más detalle
              console.error("Error al convertir base64 a ArrayBuffer:", error);
              throw error; // Propaga el error para manejo adicional si es necesario
          }
      }
        if (Array.isArray(seguridadobservacion) && seguridadobservacion.length > 0) {
          const checkmarkImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAQmSURBVGhD7ZpJKH1RGMDve2QKGYuFEqUMiRAroUQ2hg0bGTLtZGOplCVZSSyIFEWKMmaj2KGkZCNDLIwb8/j973f63vPOO/dNf+8O79//V1/efee7dX73nHPP8JhARvoHMNNfn8dnRTY3N6WpqSm6ksGu5Uvc3t5CY2MjmEwmiIyMhJubG/a9T4ksLi5CXFwcjmkWOTk5cHp6ysp8QuTh4QFaWlpYK6CA2WyGzs5O+Pj4oAwfENnf34eUlBRrK4SFhcHs7CyV/mBokbGxMQgKCrJKJCcnw+HhIZXyGFLk9fUV2tvbrQIYhYWFcH9/TxkihhO5vr5mlbaVqK+vh7e3N8pQxlAiR0dHkJSUZBXAwd3d3Q3f39+U4RjDiGxtbbF5wSKBb6aBgQEqdY0hRJaXlyEkJMQq4efnB8PDw1TqHrqLzMzMgL+/PycxOjpKpe6jq8jExIR1ksPA7uRpS1jQTcReAj8PDg5SqefoIjI9Pc1JYPT09FDp36G5CC78bMcEBq6j3HnFOkNTEXkPwS05MCoqKuDz85My/h7NRA4ODiA8PJyTyM7OhsfHR8r4HZqIXFxcQEJCAicRHx8P5+fnlPF7VBfBJ44bIFsJ7F7b29uU4R1UFfn6+oKamhpOAt9WIyMjlOE9VBXp7e3lJDAaGhqo1LuoJrK0tCTMFRkZGfD8/EwZ3kUVkePjY4iIiOAkQkNDHe7uvIHXRV5eXiA3N5eTwFBjXNjCiby/v7ONfVNTE9TW1rLPns64XV1dgkRVVdWvZ25XWEX29vYgMzNTqERHRwd7+7jDysoKW8Ha3h8bGwtXV1eUoR5MZH5+HgIDA7kK2EZfXx9Ldgae+NkenllC6ehGDZgIdqmFhQVITEwUKoKBi7ydnR12gxLYberq6oT7qqurKUN9uDGCJxjp6elChTDy8vIcdjFsUft8XFddXl5ShvpwIsjJyYnw6rQE7iPswbMmXDfZ5/b391OGNggiyOTkpFAxjNTUVGHJ3dbWJuSlpaVx57JaoCiCXaigoECoIMbc3BxlAVv42b+lcDZfW1ujDO1QFEFwE2RbQUvk5+ezwY1PPCsrSygvLS1Vfc5QwqEIUlxcLFQUnzi2BJ522JfhUc7u7i7drS1ORdbX14XKYhQVFUFMTIzwfWVlJd2pPU5FsIsodR+lwLGiV2sgTkWQ8fFxxYrbR3l5Od2hDy5FcP8QHR2tWHlL4LjZ2NigO/TB5c/TwcHBUnNzM10pI88vUklJCV3pg1u/s7e2tkryGKArEXlSlORWoSudoJZxCg56+Ykrdis8Ebm7u6NM/XCrRfBpy/sSuvpBXhhKQ0NDUlRUFH2jIyTkkqenJ24xWVZWBmdnZ1SqP26LIPKgh4CAAPaTmB7LEGd49G9Oq6urkryTlOSlC31jHP7/v5axkKQ/E5O9NqOelV4AAAAASUVORK5CYII='; // Tu imagen base64 completa
          const imageBytes = base64ToArrayBuffer(checkmarkImageBase64.split(',')[1]);
          const checkmarkImage = await pdfDoc.embedPng(imageBytes);
          seguridadobservacion.forEach((observacion, index) => {
            let yPosition = height - 266 - (index * 12); // Ajusta la altura para cada observación

            if (observacion.bueno) {
              newPage.drawImage(checkmarkImage, {
                  x: 462, // Ajusta según sea necesario
                  y: yPosition, // Ajusta según sea necesario
                  width: 6, // Ajusta según sea necesario
                  height: 5 // Ajusta según sea necesario
              });
          }
            const naText = observacion.na ? 'NA' : '';// Si na es true, muestra '✓', sino nada
            newPage.drawText(naText, { font, size: 5, x: 491, y: yPosition });
            newPage.drawText(observacion.observacion, { font, size: textSize, x: 510, y: yPosition });
          });
        } else {
          console.error('No se encontraron observaciones para el lote_id:', resultados.lote_id);
        }


        if (Array.isArray(pat1spt1) && pat1spt1.length > 0) {
            console.log("pat1spt1:", pat1spt1);
            let baseYPosition = height - 310;
            const positions = {

                soldadura: { x: 70, y: baseYPosition - 165  },//x: 155, y: baseYPosition - 285
                conductor: { x: 155, y: baseYPosition - 150 },
                conector: { x: 215, y: baseYPosition - 185},
                caja_de_Registro: { x: 195, y: baseYPosition - 210 },
                electrodo: {x: 155, y: baseYPosition - 230   }, //x: 215, y: baseYPosition - 185
                identificacion: { x: 170, y: baseYPosition - 285 },

            };
            Object.entries(pat1spt1[0]).forEach(([key, value]) => {
                const cleanKey = key.trim(); // Limpiar la clave
                if (cleanKey === 'pat1Spt1Id') {
                    return; // Saltar a la siguiente iteración del bucle
                }
                 const { x, y } = positions[cleanKey];
                let textColor = value === 'Buen Estado' ? greenColor : redColor;
                newPage.drawText(` ${value}`, { font, size: textSize, x, y, color: textColor });
            });
        } else {
            console.error('No se encontraron pozos de tierra No AI para el lote_id:', resultados.lote_id);
        }

        if (Array.isArray(pat2spt1) && pat2spt1.length > 0) {
            console.log("pat2spt1:", pat2spt1);
            let baseYPosition = height - 310;
            const positions = {
                soldadura: { x: 250, y: baseYPosition - 165 },
                conductor: { x: 325, y: baseYPosition - 150 },
                conector: { x: 395, y: baseYPosition - 185 },
                caja_de_Registro: { x: 385, y: baseYPosition - 210 },
                electrodo: { x: 325, y: baseYPosition - 230 },
                identificacion: { x: 335, y: baseYPosition - 285 },
            };
            Object.entries(pat2spt1[0]).forEach(([key, value]) => {
                const cleanKey = key.trim(); // Limpiar la clave
                if (cleanKey === 'pat2Spt1Id') {
                    return;
                }
                const { x, y } = positions[cleanKey];
                let textColor = value === 'Buen Estado' ? greenColor : redColor;
                newPage.drawText(`${value}`, { font, size: textSize, x, y, color: textColor });
            });
        } else {
            console.error('No se encontraron pozos de tierra No AI para el lote_id:', resultados.lote_id);
        }

        if (Array.isArray(pat3spt1) && pat3spt1.length > 0) {
            console.log("pat3spt1:", pat3spt1);
            let baseYPosition = height - 310;
            const positions = {
                soldadura: { x: 475, y: baseYPosition - 165 },
                conductor: { x: 555, y: baseYPosition - 150 },
                conector: { x: 615, y: baseYPosition - 185 },
                caja_de_Registro: { x: 595, y: baseYPosition - 210 },
                electrodo: { x: 555, y: baseYPosition - 230 },
                identificacion: { x: 555, y: baseYPosition - 285 },
            };

            Object.entries(pat3spt1[0]).forEach(([key, value]) => {
                const cleanKey = key.trim();
                if (cleanKey === 'pat3Spt1Id') {
                    return;
                }
                const { x, y } = positions[cleanKey];
                let textColor = value === 'Buen Estado' ? greenColor : redColor;
                newPage.drawText(`${value}`, { font, size: textSize, x, y, color: textColor });
            });
        } else {
            console.error('No se encontraron pozos de tierra No AI para el lote_id:', resultados.lote_id);
        }

        if (Array.isArray(pat4spt1) && pat4spt1.length > 0) {
            console.log("pat4spt1:", pat4spt1);
            let baseYPosition = height - 310;
            const positions = {
                soldadura: { x: 650, y: baseYPosition - 165 },
                conductor: { x: 730, y: baseYPosition - 150 },
                conector: { x: 790, y: baseYPosition - 185 },
                caja_de_Registro: { x: 770, y: baseYPosition - 210 },
                electrodo: { x: 730, y: baseYPosition - 230 },
                identificacion: { x: 730, y: baseYPosition - 285 },
            };
            Object.entries(pat4spt1[0]).forEach(([key, value]) => {
                const cleanKey = key.trim();
                if (cleanKey === 'pat4Spt1Id') {
                    return;
                }
                const { x, y } = positions[cleanKey];
                let textColor = value === 'Buen Estado' ? greenColor : redColor;
                newPage.drawText(`${value}`, { font, size: textSize, x, y, color: textColor });
            });
        } else {
            console.error('No se encontraron pozos de tierra No AI para el lote_id:', resultados.lote_id);
        }

      if (Array.isArray(barra_e_Ai) && barra_e_Ai.length > 0) {
        let baseYPosition = height - 500;
        if (barra_e_Ai[0]) {
          let yPosition = baseYPosition - 230;
          const textColor = barra_e_Ai[0].seleccionado === 'Conductor' ? greenColor : redColor;
          newPage.drawText(barra_e_Ai[0].seleccionado, { font, size: textSize, x: 665, y: yPosition,color:textColor });  //CONDUCTOR
        }
        if (barra_e_Ai[1]) {
          let yPosition = baseYPosition - 165;
          const textColor = barra_e_Ai[1].seleccionado === 'Aislador' ? greenColor : redColor;
          newPage.drawText(barra_e_Ai[1].seleccionado, { font, size: textSize, x: 595, y: yPosition,color:textColor }); //AISLADOR
        }
        if (barra_e_Ai[2]) {
          let yPosition = baseYPosition - 150;
          const textColor = barra_e_Ai[2].seleccionado === 'P.Sujecion' ? greenColor : redColor;
          newPage.drawText(barra_e_Ai[2].seleccionado, { font, size: textSize, x: 665, y: yPosition ,color:textColor}); //P.Sujecion
        }
        if (barra_e_Ai[3]) {
          let yPosition = baseYPosition - 185; // Resta 90 para el cuarto elemento
          const textColor = barra_e_Ai[3].seleccionado === 'Barra' ? greenColor : redColor;
          newPage.drawText(barra_e_Ai[3].seleccionado, { font, size: textSize, x: 595, y: yPosition ,color:textColor });  //BARRA
        }
        if (barra_e_Ai[4]) {
          let yPosition = baseYPosition - 210;
          const textColor = barra_e_Ai[4].seleccionado === 'Señaletica' ? greenColor : redColor;
          newPage.drawText(barra_e_Ai[4].seleccionado, { font, size: textSize, x: 760, y: yPosition ,color:textColor}); //Señaletica
        }
        if (barra_e_Ai[5]) {
          let yPosition = baseYPosition - 285;
          const textColor = barra_e_Ai[5].seleccionado === 'ID subida' ? greenColor : redColor;
          newPage.drawText(barra_e_Ai[5].seleccionado, { font, size: textSize, x: 745, y: yPosition ,color:textColor }); //ID subida
        }

      } else {
        console.error('No se encontraron pozos de tierra No AI para el lote_id:', resultados.lote_id);
      }


      if (Array.isArray(barra_e_noAi) && barra_e_noAi.length > 0) {
        let baseYPosition = height - 500;
        if (barra_e_noAi[0]) {
          let yPosition = baseYPosition - 200;
          const textColor = barra_e_noAi[0].seleccionado === 'Barra' ? greenColor : redColor;
          newPage.drawText(barra_e_noAi[0].seleccionado, { font, size: textSize, x: 155, y: yPosition ,color:textColor}); //BARRA
        }
        if (barra_e_noAi[1]) {
          let yPosition = baseYPosition - 145;
          const textColor = barra_e_noAi[1].seleccionado === 'P.Subjecion' ? greenColor : redColor;
          newPage.drawText(barra_e_noAi[1].seleccionado, { font, size: textSize, x: 185, y: yPosition,color:textColor }); //P.subjecion
        }
        if (barra_e_noAi[2]) {
          let yPosition = baseYPosition - 145;
          const textColor = barra_e_noAi[2].seleccionado === 'Conductor' ? greenColor : redColor;
          newPage.drawText(barra_e_noAi[2].seleccionado, { font, size: textSize, x: 300, y: yPosition ,color:textColor}); //CONDUCTOR
        }
        if (barra_e_noAi[3]) {
          let yPosition = baseYPosition - 275;
          const textColor = barra_e_noAi[3].seleccionado === 'ID subida' ? greenColor : redColor;
          newPage.drawText(barra_e_noAi[3].seleccionado, { font, size: textSize, x: 180, y: yPosition ,color:textColor}); //ID SUBIDA
        }
        if (barra_e_noAi[4]) {
          let yPosition = baseYPosition - 280;
          const textColor = barra_e_noAi[4].seleccionado === 'Terminales' ? greenColor : redColor;
          newPage.drawText(barra_e_noAi[4].seleccionado, { font, size: textSize, x: 370, y: yPosition ,color:textColor}); //TERMINALES
        }
        if (barra_e_noAi[5]) {
          let yPosition = baseYPosition - 150;
          const textColor = barra_e_noAi[5].seleccionado === 'Señaletica' ? greenColor : redColor;
          newPage.drawText(barra_e_noAi[5].seleccionado, { font, size: textSize, x: 400, y: yPosition ,color:textColor}); //SEÑALETICA
        }

      } else {
        console.error('No se encontraron pozos de tierra No AI para el lote_id:', resultados.lote_id);
      }

      if (Array.isArray(cerco_p_Ai) && cerco_p_Ai.length > 0) {
        let baseYPosition = height - 485;
        if (cerco_p_Ai[0]) {
          let yPosition = baseYPosition - 340;
          const textColor = cerco_p_Ai[0].seleccionado === 'Conector' ? greenColor : redColor;
          newPage.drawText(cerco_p_Ai[0].seleccionado, { font, size: textSize, x: 675, y: yPosition ,color:textColor }); //CONECTOR
        }
        if (cerco_p_Ai[1]) {
          let yPosition = baseYPosition - 380;
          const textColor = cerco_p_Ai[1].seleccionado === 'Conductor' ? greenColor : redColor;
          newPage.drawText(cerco_p_Ai[1].seleccionado, { font, size: textSize, x: 680, y: yPosition ,color:textColor }); //CONDUCTOR
        }

        if (cerco_p_Ai[2]) {
          let yPosition = baseYPosition - 435;
          const textColor = cerco_p_Ai[2].seleccionado === 'Cta.Trenzada' ? greenColor : redColor;
          newPage.drawText(cerco_p_Ai[2].seleccionado, { font, size: textSize, x: 520, y: yPosition ,color:textColor }); //CTA.TRENZADA
        }

      } else {

      }

      if (Array.isArray(cerco_p_noAi) && cerco_p_noAi.length > 0) {
        let baseYPosition = height - 485;
        if (cerco_p_noAi[0]) {
          let yPosition = baseYPosition - 355;
          const textColor = cerco_p_noAi[0].seleccionado === 'P.Subjecion' ? greenColor : redColor;
          newPage.drawText(cerco_p_noAi[0].seleccionado, { font, size: textSize, x: 465, y: yPosition ,color:textColor }); //P.SUJECION
        }
        if (cerco_p_noAi[1]) {
          let yPosition = baseYPosition - 345;
          const textColor = cerco_p_noAi[1].seleccionado === 'Terminales' ? greenColor : redColor;
          newPage.drawText(cerco_p_noAi[1].seleccionado, { font, size: textSize, x: 240, y: yPosition ,color:textColor }); //TERMINALES
        }
        if (cerco_p_noAi[2]) {
          let yPosition = baseYPosition - 415;
          const textColor = cerco_p_noAi[2].seleccionado === 'ID subida' ? greenColor : redColor;
          newPage.drawText(cerco_p_noAi[2].seleccionado, { font, size: textSize, x: 220, y: yPosition ,color:textColor }); //ID SUBIDA
        }
        if (cerco_p_noAi[3]) {
          let yPosition = baseYPosition - 340;
          const textColor = cerco_p_noAi[3].seleccionado === 'Señaletica' ? greenColor : redColor;
          newPage.drawText(cerco_p_noAi[3].seleccionado, { font, size: textSize, x: 350, y: yPosition ,color:textColor  }); //SEÑALETCA
        }

      } else {

      }

      if (Array.isArray(transformador_noAi) && transformador_noAi.length > 0) {
        let baseYPosition = height - 510;
        if (transformador_noAi[0]) {
          let yPosition = baseYPosition - 485;
          const textColor = transformador_noAi[0].seleccionado === 'Señaletica' ? greenColor : redColor;
          newPage.drawText(transformador_noAi[0].seleccionado, { font, size: textSize, x: 460, y: yPosition ,color:textColor}); //SEÑALETICA
        }
        if (transformador_noAi[1]) {
          let yPosition = baseYPosition - 475;
          const textColor = transformador_noAi[1].seleccionado === 'Abrazadera' ? greenColor : redColor;
          newPage.drawText(transformador_noAi[1].seleccionado, { font, size: textSize, x: 245, y: yPosition  ,color:textColor}); //ABRAZADERA
        }
        if (transformador_noAi[2]) {
          let yPosition = baseYPosition - 535;
          const textColor = transformador_noAi[2].seleccionado === 'Conductor' ? greenColor : redColor;
          newPage.drawText(transformador_noAi[2].seleccionado, { font, size: textSize, x: 250, y: yPosition  ,color:textColor}); //CONDUCTOR
        }
        if (transformador_noAi[3]) {
          let yPosition = baseYPosition - 565;
          const textColor = transformador_noAi[3].seleccionado === 'ID subida' ? greenColor : redColor;
          newPage.drawText(transformador_noAi[3].seleccionado, { font, size: textSize, x: 210, y: yPosition ,color:textColor}); //IDSUBIDA
        }

      } else {

      }

      if (Array.isArray(recomendacion) && recomendacion.length > 0) {
        recomendacion.forEach((recomendacion, index) => {
          let yPosition = height - 1145 - (index * 16); // Ajusta la altura para cada observación

          newPage.drawText(recomendacion.observacion, { font, size: textSize, x: 110, y: yPosition });
          newPage.drawText(recomendacion.aviso, { font, size: textSize, x: 740, y: yPosition });
        });
      } else {
        console.error('No se encontraron recomendaciones para el lote_id:', resultados.recomendacion_lote_id);
      }

      if (tipostp) {
        const miImagenBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAQmSURBVGhD7ZpJKH1RGMDve2QKGYuFEqUMiRAroUQ2hg0bGTLtZGOplCVZSSyIFEWKMmaj2KGkZCNDLIwb8/j973f63vPOO/dNf+8O79//V1/efee7dX73nHPP8JhARvoHMNNfn8dnRTY3N6WpqSm6ksGu5Uvc3t5CY2MjmEwmiIyMhJubG/a9T4ksLi5CXFwcjmkWOTk5cHp6ysp8QuTh4QFaWlpYK6CA2WyGzs5O+Pj4oAwfENnf34eUlBRrK4SFhcHs7CyV/mBokbGxMQgKCrJKJCcnw+HhIZXyGFLk9fUV2tvbrQIYhYWFcH9/TxkihhO5vr5mlbaVqK+vh7e3N8pQxlAiR0dHkJSUZBXAwd3d3Q3f39+U4RjDiGxtbbF5wSKBb6aBgQEqdY0hRJaXlyEkJMQq4efnB8PDw1TqHrqLzMzMgL+/PycxOjpKpe6jq8jExIR1ksPA7uRpS1jQTcReAj8PDg5SqefoIjI9Pc1JYPT09FDp36G5CC78bMcEBq6j3HnFOkNTEXkPwS05MCoqKuDz85My/h7NRA4ODiA8PJyTyM7OhsfHR8r4HZqIXFxcQEJCAicRHx8P5+fnlPF7VBfBJ44bIFsJ7F7b29uU4R1UFfn6+oKamhpOAt9WIyMjlOE9VBXp7e3lJDAaGhqo1LuoJrK0tCTMFRkZGfD8/EwZ3kUVkePjY4iIiOAkQkNDHe7uvIHXRV5eXiA3N5eTwFBjXNjCiby/v7ONfVNTE9TW1rLPns64XV1dgkRVVdWvZ25XWEX29vYgMzNTqERHRwd7+7jDysoKW8Ha3h8bGwtXV1eUoR5MZH5+HgIDA7kK2EZfXx9Ldgae+NkenllC6ehGDZgIdqmFhQVITEwUKoKBi7ydnR12gxLYberq6oT7qqurKUN9uDGCJxjp6elChTDy8vIcdjFsUft8XFddXl5ShvpwIsjJyYnw6rQE7iPswbMmXDfZ5/b391OGNggiyOTkpFAxjNTUVGHJ3dbWJuSlpaVx57JaoCiCXaigoECoIMbc3BxlAVv42b+lcDZfW1ujDO1QFEFwE2RbQUvk5+ezwY1PPCsrSygvLS1Vfc5QwqEIUlxcLFQUnzi2BJ522JfhUc7u7i7drS1ORdbX14XKYhQVFUFMTIzwfWVlJd2pPU5FsIsodR+lwLGiV2sgTkWQ8fFxxYrbR3l5Od2hDy5FcP8QHR2tWHlL4LjZ2NigO/TB5c/TwcHBUnNzM10pI88vUklJCV3pg1u/s7e2tkryGKArEXlSlORWoSudoJZxCg56+Ykrdis8Ebm7u6NM/XCrRfBpy/sSuvpBXhhKQ0NDUlRUFH2jIyTkkqenJ24xWVZWBmdnZ1SqP26LIPKgh4CAAPaTmB7LEGd49G9Oq6urkryTlOSlC31jHP7/v5axkKQ/E5O9NqOelV4AAAAASUVORK5CYII='; // Tu imagen base64 completa
        const imageBytes = base64ToArrayBuffer(miImagenBase64.split(',')[1]);
        const miImagen = await pdfDoc.embedPng(imageBytes);

        if (tipostp.aislado) {
            newPage.drawImage(miImagen, { x: 195, y: height - 365, width: 5, height: 5 });
        }
        if(tipostp.contrapeso){
          newPage.drawImage(miImagen,{ x: 330, y: height - 365 , width: 5, height: 5 });
        }
        if(tipostp.horizontal){
          newPage.drawImage(miImagen, {x: 465, y: height - 365 , width: 5, height: 5 });
        }
        if(tipostp.vertical){
          newPage.drawImage(miImagen,{ x: 600, y: height - 365 , width: 5, height: 5 });
        }
        if(tipostp.delta){
          newPage.drawImage(miImagen, { x: 735, y: height - 365 , width: 5, height: 5  });
        }
        if(tipostp.malla){
          newPage.drawImage(miImagen,{ x: 870, y: height - 365 , width: 5, height: 5 });
        }

    } else {
        console.error('No se encontraron tipostp para el lote_id:', resultados.id_tipostp);
    }


    if (UsuarioService && UsuarioService.firma) {
      newPage.drawText(UsuarioService.usuario, { font, size: textSize, x: 170, y: height - 1207 });
      newPage.drawText(UsuarioService.fotocheck.toString(), { font, size: textSize, x: 170, y: height - 1222 });
      try {
          // Extraer datos de la firma y el formato
          const match = UsuarioService.firma.match(/^data:(image\/[a-z]+);base64,(.*)$/);
          if (!match) {
              throw new Error("Formato de firma no reconocido o firma ausente.");
          }
          const [, imageFormat, base64Data] = match;
          let firmaBytes = base64ToArrayBuffer(base64Data);
          let firmaImage;
          switch (imageFormat) {
              case 'image/jpeg':
                  firmaImage = await pdfDoc.embedJpg(firmaBytes);
                  break;
              case 'image/png':
                  firmaImage = await pdfDoc.embedPng(firmaBytes);
                  break;
              // Agrega más casos para otros formatos si es necesario
              default:
                  throw new Error(`Formato de imagen no soportado: ${imageFormat}`);
          }
          const xPosition = 170; // Cambiar según sea necesario
          const yPosition = 10; // Cambiar según sea necesario
          const width = 80; // Cambiar según sea necesario
          const height = 30; // Cambiar según sea necesario

          newPage.drawImage(firmaImage, {
              x: xPosition,
              y: yPosition,
              width: width,
              height: height,
          });

      } catch (error) {
          console.error("Se produjo un error durante el proceso de firma del PDF: ", error);
          // Manejo adicional del error, notificaciones, etc.
      }
    } else {
      console.error('No se encontró información de firma del usuario o el servicio de usuario no está disponible.');
    }
    if (UsuarioService1 && UsuarioService1.firma) {
      newPage.drawText(UsuarioService1.usuario, { font, size: textSize, x: 440, y: height - 1207 });
      newPage.drawText(UsuarioService1.fotocheck.toString(), { font, size: textSize, x: 440, y: height - 1222 });
      if (resultados.firma === true) {
        try {
            // Extraer datos de la firma y el formato
            const match = UsuarioService1.firma.match(/^data:(image\/[a-z]+);base64,(.*)$/);
            if (!match) {
                throw new Error("Formato de firma no reconocido o firma ausente.");
            }
            const [, imageFormat, base64Data] = match;
            let firmaBytes = base64ToArrayBuffer(base64Data);
            let firmaImage;
            switch (imageFormat) {
                case 'image/jpeg':
                    firmaImage = await pdfDoc.embedJpg(firmaBytes);
                    break;
                case 'image/png':
                    firmaImage = await pdfDoc.embedPng(firmaBytes);
                    break;
                // Agrega más casos para otros formatos si es necesario
                default:
                    throw new Error(`Formato de imagen no soportado: ${imageFormat}`);
            }
            const xPosition = 440; // Cambiar según sea necesario
            const yPosition = 10; // Cambiar según sea necesario
            const width = 80; // Cambiar según sea necesario
            const height = 30; // Cambiar según sea necesario

            newPage.drawImage(firmaImage, {
                x: xPosition,
                y: yPosition,
                width: width,
                height: height,
            });

        } catch (error) {
            console.error("Se produjo un error durante el proceso de firma del PDF: ", error);

        }
    }
    } else {
      console.error('No se encontró información de firma del usuario o el servicio de usuario no está disponible.');
    }
      const modifiedPdfBytes = await pdfDoc.save();
      const modifiedPdfBlob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
      const modifiedPdfUrl = URL.createObjectURL(modifiedPdfBlob);
      window.open(modifiedPdfUrl, '_blank');

    } catch (error) {
      console.log('Error al generar el PDF:', error);
    }
    }



}
*/
