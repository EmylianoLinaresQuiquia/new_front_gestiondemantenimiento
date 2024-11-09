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


        //drawText(resultado.metodoSelectivo[0]?.selectivo_conclusiones || '', 130, height - 905);
        //drawText(resultado.metodoCaida[0]?.caida_conclusiones || '', 130, height - 610);


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


                const addImageToPdf = async (url: string, x: number, y: number, width: number, height: number) => {
                  if (!url) return; // Salta si la URL es vacía

                  try {
                    const imageBytes = await fetch(url).then(res => res.arrayBuffer());
                    const fileType = new Uint8Array(imageBytes.slice(0, 4)).join(""); // Chequear los primeros bytes

                    let image;
                    if (fileType.startsWith("255216")) { // Detecta JPEG
                      image = await pdfDoc.embedJpg(imageBytes);
                    } else if (fileType.startsWith("13780")) { // Detecta PNG
                      image = await pdfDoc.embedPng(imageBytes);
                    } else {
                      console.error("Formato de imagen no soportado o imagen no válida:", url);
                      return;
                    }

                    newPage.drawImage(image, { x, y, width, height });
                  } catch (error) {
                    console.error("Error al incrustar imagen:", error);
                  }
                };




    // Agregar las imágenes en posiciones específicas en el PDF
    await addImageToPdf(resultado.datosSpt2.imagen1, 150, height - 1260, 150, 100); // Posición y tamaño de la imagen 1
    await addImageToPdf(resultado.datosSpt2.imagen2, 350, height - 1260, 150, 100); // Posición y tamaño de la imagen 2
    await addImageToPdf(resultado.datosSpt2.imagen2, 550, height - 1260, 150, 100);
    await addImageToPdf(resultado.datosSpt2.imagen4, 750, height - 1260, 150, 100); // Posición y tamaño de la imagen 4


                                                                      //x           //y    //ancho   //alto
    await addImageToPdf(resultado.metodoCaida[0]?.caida_esquema || '', 582, height - 575, 250, 185);
    await addImageToPdf(resultado.metodoSelectivo[0]?.selectivo_esquema || '', 582, height - 870, 250, 185);



    let contadorPatcaida = 1;
    resultado.metodoCaida.forEach((item, index) => {
      // Verificamos que el item y item.resultado existan y tengan longitud mayor a 0
      const registroCount = item.resultado?.length || 0;
      const mensaje = registroCount > 0 ? `PAT${contadorPatcaida}` : '';
      // Solo dibuja el texto si hay mensaje
      if (mensaje) {
          // Ajusta las coordenadas en función del índice para evitar superposición
          const posY = height - 500 - (contadorPatcaida * 20); // Ejemplo: ajusta 20px de separación entre textos
          drawText(mensaje, 135, posY)

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
      const yOhmResultado = currentYohm + 90; // Para `Ohm` y `Resultado`, ligeramente por debajo de `Conclusiones`
      const yPat = currentY + 185; // Exclusiva para los valores `Pat`, más abajo para evitar superposición
      const resultadoColor: [number, number, number] = registro.resultado === 'CUMPLE'
        ? [0, 1, 0]  // Verde (0, 1, 0)
        : [1, 0, 0]; // Rojo (1, 0, 0)

      // `Ohm` y `Resultado` en `yOhmResultado`
      drawText(`${registro.ohm || ''}`, xOhm, yOhmResultado, [0, 0, 0]);
      drawText(`${registro.resultado || ''}`, xResultado, yOhmResultado, resultadoColor);
      // Valores de `Pat` en la posición `yPat`
      drawText(`${registro.pat1 || ''}`, xPat1, yPat, [0, 0, 0]);
      drawText(`${registro.pat2 || ''}`, xPat2, yPat, [0, 0, 0]);
      drawText(`${registro.pat3 || ''}`, xPat3, yPat, [0, 0, 0]);
      drawText(`${registro.pat4 || ''}`, xPat4, yPat, [0, 0, 0]);
  });




  let contadorPatselectivo = 1;
  resultado.metodoSelectivo.forEach((item, index) => {
    // Verificamos que el item y item.resultado existan y tengan longitud mayor a 0
    const registroCount = item.resultado?.length || 0;
    const mensaje = registroCount > 0 ? `PAT${contadorPatselectivo}` : '';
    // Solo dibuja el texto si hay mensaje
    if (mensaje) {
        // Ajusta las coordenadas en función del índice para evitar superposición
        const posY = height - 795 - (contadorPatselectivo * 20); // Ejemplo: ajusta 20px de separación entre textos
        drawText(mensaje, 135, posY)

        // Incrementa el contador para el siguiente mensaje
        contadorPatselectivo++;
    }
});
    //METODO SELECTIVO
    drawText(resultado.metodoSelectivo[0]?.selectivo_conclusiones || '', 130, height - 905);
    resultado.metodoSelectivo.forEach((registro: any, index: number) => {
      const currentY = startY - index * lineHeight * 2.2; // Ajusta el espacio entre registros completos
      const currentYohm = startY - index * lineHeight * 4;
      const xOhm = 190;
      const xPat1 = 375;
      const xPat2 = 425;
      const xPat3 = 475;
      const xPat4 = 525;
      const xResultado = 270;
      const yOhmResultado = currentYohm - 205; // Para `Ohm` y `Resultado`, ligeramente por debajo de `Conclusiones`
      const yPat = currentY - 100; // Exclusiva para los valores `Pat`, más abajo para evitar superposición
      const resultadoColor: [number, number, number] = registro.resultado === 'CUMPLE'
        ? [0, 1, 0]  // Verde (0, 1, 0)
        : [1, 0, 0]; // Rojo (1, 0, 0)
      drawText(`${registro.ohm || ''}`, xOhm, yOhmResultado, [0, 0, 0]);
      drawText(`${registro.resultado || ''}`, xResultado, yOhmResultado,resultadoColor);
      drawText(`${registro.pat1 || ''}`, xPat1, yPat, [0, 0, 0]);
      drawText(`${registro.pat2 || ''}`, xPat2, yPat, [0, 0, 0]);
      drawText(`${registro.pat3 || ''}`, xPat3, yPat, [0, 0, 0]);
      drawText(`${registro.pat4 || ''}`, xPat4, yPat, [0, 0, 0]);
    });



    let contadorPatsujecion = 1;
    resultado.metodoSujecion.forEach((item, index) => {
      // Verificamos que el item y item.resultado existan y tengan longitud mayor a 0
      const registroCount = item.resultado?.length || 0;
      const mensaje = registroCount > 0 ? `PAT${contadorPatsujecion}` : '';
      // Solo dibuja el texto si hay mensaje
      if (mensaje) {
          // Ajusta las coordenadas en función del índice para evitar superposición
          const posY = height - 995 - (contadorPatsujecion * 20); // Ejemplo: ajusta 20px de separación entre textos
          drawText(mensaje, 190, posY)

          // Incrementa el contador para el siguiente mensaje
          contadorPatsujecion++;
      }
  });

    //METODO SUJECION
    drawText(resultado.metodoSujecion[0]?.sujecion_conclusiones || '', 130, height - 1105);
    resultado.metodoSujecion.forEach((registro: any, index: number) => {
      const currentY = startY - index * lineHeight * 2.2; // Ajusta el espacio entre registros completos
      const currentYohm = startY - index * lineHeight * 4;
      const xOhm = 260;
      const xResultado = 340;
      const resultadoColor: [number, number, number] = registro.resultado === 'CUMPLE'
        ? [0, 1, 0]  // Verde (0, 1, 0)
        : [1, 0, 0]; // Rojo (1, 0, 0)
      const yOhmResultado = currentYohm - 405; // Para `Ohm` y `Resultado`, ligeramente por debajo de `Conclusiones`
      drawText(`${registro.ohm || ''}`, xOhm, yOhmResultado, [0, 0, 0]);
      drawText(`${registro.resultado || ''}`, xResultado, yOhmResultado,resultadoColor);

    });


                                                                  //x         //y
    await addImageToPdf(resultado.datosSpt2.usuario1_firma || '', 810, height - 1302, 100, 30);
    if(resultado.datosSpt2.firmado === true){
      await addImageToPdf(resultado.datosSpt2.usuario2_firma || '', 810, height - 1336, 100, 30);
    }

               /* if (resultados.length > 0) {
                  const resultado = resultados[0]; // Tomamos el primer elemento como ejemplo

                  // Rutas de las imágenes del reporte
                  const imagenesRutas = [resultado.imagen1, resultado.imagen2, resultado.imagen3, resultado.imagen4];

                  for (const [index, rutaImagen] of imagenesRutas.entries()) {
                    if (rutaImagen) {
                      try {
                        // Convertimos el Observable a Promesa y verificamos si la imagen es válida
                        const imagenBase64 = await this.spt2Service.obtenerImagenBase64(rutaImagen).toPromise();

                        if (imagenBase64) {
                          const match = imagenBase64.match(/^data:(image\/[a-z]+);base64,(.*)$/);
                          if (!match) throw new Error("Formato de imagen no reconocido o imagen ausente.");

                          const [, imageFormat, base64Data] = match;
                          const imageBytes = base64ToArrayBuffer(base64Data);
                          let image;

                          if (imageFormat === 'image/jpeg') image = await pdfDoc.embedJpg(imageBytes);
                          else if (imageFormat === 'image/png') image = await pdfDoc.embedPng(imageBytes);
                          else throw new Error(`Formato de imagen no soportado: ${imageFormat}`);

                          // Posición y tamaño de la imagen
                          newPage.drawImage(image, {
                            x: 50,
                            y: 400 - (index * 100), // Cambia la posición en Y para cada imagen
                            width: 150,
                            height: 100
                          });
                        } else {
                          console.warn(`La imagen en la ruta ${rutaImagen} no se pudo obtener o está vacía.`);
                        }
                      } catch (error) {
                        console.error(`Error al agregar la imagen ${index + 1}:`, error);
                      }
                    }
                  }
                }




              // Asegúrate de que hay al menos un elemento en resultados
if (resultados.length > 0) {
  const resultado = resultados[0]; // Usamos el primer elemento del array para este ejemplo
  // Verificar si hay datos de firma para el líder

if (resultado.usuario1_firma) {
  try {
    const matchLider = resultado.usuario1_firma.match(/^data:(image\/[a-z]+);base64,(.*)$/);
    if (!matchLider) throw new Error("Formato de firma del líder no reconocido o firma ausente.");

    const [, imageFormatLider, base64DataLider] = matchLider;
    let firmaLiderBytes = base64ToArrayBuffer(base64DataLider);

    // Embedding de la firma
    let firmaLiderImage;
    if (imageFormatLider === 'image/jpeg') firmaLiderImage = await pdfDoc.embedJpg(firmaLiderBytes);
    else if (imageFormatLider === 'image/png') firmaLiderImage = await pdfDoc.embedPng(firmaLiderBytes);
    else throw new Error(`Formato de imagen del líder no soportado: ${imageFormatLider}`);

    console.log("Imagen del líder embebida correctamente.");

    // Dibujar la firma en el PDF
    newPage.drawImage(firmaLiderImage, {
      x: 820,  // Cambiar las coordenadas para pruebas
      y: 165,  // para asegurarse de que la firma esté en la zona visible
      width: 80,  // Cambiar el tamaño para pruebas
      height: 28,
    });

    console.log("Firma del líder insertada en el PDF.");
  } catch (error) {
    console.error("Error al procesar la firma del líder:", error);
  }
}


  // Verificar si hay datos de firma para el supervisor
  if (resultado.usuario2_firma) {
    try {
      const matchSupervisor = resultado.usuario2_firma.match(/^data:(image\/[a-z]+);base64,(.*)$/);
      if (!matchSupervisor) {
        throw new Error("Formato de firma del supervisor no reconocido o firma ausente.");
      }
      const [, imageFormatSupervisor, base64DataSupervisor] = matchSupervisor;

      let firmaSupervisorBytes = base64ToArrayBuffer(base64DataSupervisor);
      let firmaSupervisorImage;

      switch (imageFormatSupervisor) {
        case 'image/jpeg':
          firmaSupervisorImage = await pdfDoc.embedJpg(firmaSupervisorBytes);
          break;
        case 'image/png':
          firmaSupervisorImage = await pdfDoc.embedPng(firmaSupervisorBytes);
          break;
        default:
          throw new Error(`Formato de imagen del supervisor no soportado: ${imageFormatSupervisor}`);
      }

      newPage.drawImage(firmaSupervisorImage, {
        x: 455,
        y: 20,
        width: 50,
        height: 25,
      });
    } catch (error) {
      console.error("Error al procesar la firma del supervisor: ", error);
    }
  }
} else {
  console.error("El array de resultados está vacío.");
}*/



        function base64ToArrayBuffer(base64: string) {
          const binaryString = window.atob(base64);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          return bytes.buffer;
        }
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



}

