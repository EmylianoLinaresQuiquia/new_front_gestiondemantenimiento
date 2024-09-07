
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
      console.log("resultados",resultados)

      // Dibujar texto en el PDF
      newPage.drawText(resultados.ot, { font, size: textSize, x: 385, y: height - 110 });
      newPage.drawText(resultados.fecha, { font, size: textSize, x: 385, y: height - 130 });
      newPage.drawText(resultados.hora_inicio, { font, size: textSize, x: 785, y: height - 110 });
      newPage.drawText(resultados.hora_fin, { font, size: textSize, x: 785, y: height - 130 });

      newPage.drawText(resultados.tag_subestacion, { font, size: textSize, x: 225, y: height - 110 });
      newPage.drawText(resultados.ubicacion, { font, size: textSize, x: 155, y: height - 130 });

      newPage.drawText(resultados.cantidad_spt, { font, size: textSize, x: 275, y: height - 395 });
      newPage.drawText(resultados.plano, { font, size: textSize, x: 525, y: height - 395 });


      newPage.drawText(resultados.lider, { font, size: textSize, x: 515, y: height - 110 });
      newPage.drawText(resultados.supervisor, { font, size: textSize, x: 515, y: height - 130 });

      // Duplicar el contenido en otras coordenadas
newPage.drawText(resultados.lider, { font, size: textSize, x: 175, y: height - 1210 });  // Cambiar las coordenadas según sea necesario
newPage.drawText(resultados.supervisor, { font, size: textSize, x: 455, y: height - 1210 });  // Cambiar las coordenadas según sea
      newPage.drawText(resultados.fotocheck_lider, { font, size: textSize, x: 175, y: height - 1225 });
      newPage.drawText(resultados.fotocheck_supervisor, { font, size: textSize, x: 455, y: height - 1225 });





// Verificar si hay datos de firma para el líder
if (resultados.firma_lider) {
  try {
      // Extraer datos de la firma y el formato
      const matchLider = resultados.firma_lider.match(/^data:(image\/[a-z]+);base64,(.*)$/);
      if (!matchLider) {
          throw new Error("Formato de firma del líder no reconocido o firma ausente.");
      }
      const [, imageFormatLider, base64DataLider] = matchLider;

      // Convertir base64 a ArrayBuffer
      let firmaLiderBytes = base64ToArrayBuffer(base64DataLider);
      let firmaLiderImage;

      // Verificar el formato de la imagen
      switch (imageFormatLider) {
          case 'image/jpeg':
              firmaLiderImage = await pdfDoc.embedJpg(firmaLiderBytes);
              break;
          case 'image/png':
              firmaLiderImage = await pdfDoc.embedPng(firmaLiderBytes);
              break;
          default:
              throw new Error(`Formato de imagen del líder no soportado: ${imageFormatLider}`);
      }

      // Obtener el tamaño original de la imagen
      const firmaLiderWidth = firmaLiderImage.width;
      const firmaLiderHeight = firmaLiderImage.height;

      // Dibujar la firma del líder en el PDF
      newPage.drawImage(firmaLiderImage, {
          x: 175,  // Cambiar según las coordenadas necesarias
          y: 20,
          width: 50,
          height: 25
      });
  } catch (error) {
      console.error("Error al procesar la firma del líder: ", error);
  }
}

/*
// Verificar si hay datos de firma para el supervisor
if (resultados.firma_supervisor) {
  try {
      // Extraer datos de la firma y el formato
      const matchSupervisor = resultados.firma_supervisor.match(/^data:(image\/[a-z]+);base64,(.*)$/);
      if (!matchSupervisor) {
          throw new Error("Formato de firma del supervisor no reconocido o firma ausente.");
      }
      const [, imageFormatSupervisor, base64DataSupervisor] = matchSupervisor;

      // Convertir base64 a ArrayBuffer
      let firmaSupervisorBytes = base64ToArrayBuffer(base64DataSupervisor);
      let firmaSupervisorImage;

      // Verificar el formato de la imagen
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


      // Dibujar la firma del supervisor en el PDF
      newPage.drawImage(firmaSupervisorImage, {
          x: 455,  // Cambiar según las coordenadas necesarias
          y:  20,
          width: 50,
          height: 25,
      });
  } catch (error) {
      console.error("Error al procesar la firma del supervisor: ", error);
  }
}

*/








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
        { x: 510, y: height - 270 },
        { x: 510, y: height - 282 },
        { x: 510, y: height - 294 },
        { x: 510, y: height - 306 },
        { x: 510, y: height - 318 }
      ]);

      const miImagenBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAQmSURBVGhD7ZpJKH1RGMDve2QKGYuFEqUMiRAroUQ2hg0bGTLtZGOplCVZSSyIFEWKMmaj2KGkZCNDLIwb8/j973f63vPOO/dNf+8O79//V1/efee7dX73nHPP8JhARvoHMNNfn8dnRTY3N6WpqSm6ksGu5Uvc3t5CY2MjmEwmiIyMhJubG/a9T4ksLi5CXFwcjmkWOTk5cHp6ysp8QuTh4QFaWlpYK6CA2WyGzs5O+Pj4oAwfENnf34eUlBRrK4SFhcHs7CyV/mBokbGxMQgKCrJKJCcnw+HhIZXyGFLk9fUV2tvbrQIYhYWFcH9/TxkihhO5vr5mlbaVqK+vh7e3N8pQxlAiR0dHkJSUZBXAwd3d3Q3f39+U4RjDiGxtbbF5wSKBb6aBgQEqdY0hRJaXlyEkJMQq4efnB8PDw1TqHrqLzMzMgL+/PycxOjpKpe6jq8jExIR1ksPA7uRpS1jQTcReAj8PDg5SqefoIjI9Pc1JYPT09FDp36G5CC78bMcEBq6j3HnFOkNTEXkPwS05MCoqKuDz85My/h7NRA4ODiA8PJyTyM7OhsfHR8r4HZqIXFxcQEJCAicRHx8P5+fnlPF7VBfBJ44bIFsJ7F7b29uU4R1UFfn6+oKamhpOAt9WIyMjlOE9VBXp7e3lJDAaGhqo1LuoJrK0tCTMFRkZGfD8/EwZ3kUVkePjY4iIiOAkQkNDHe7uvIHXRV5eXiA3N5eTwFBjXNjCiby/v7ONfVNTE9TW1rLPns64XV1dgkRVVdWvZ25XWEX29vYgMzNTqERHRwd7+7jDysoKW8Ha3h8bGwtXV1eUoR5MZH5+HgIDA7kK2EZfXx9Ldgae+NkenllC6ehGDZgIdqmFhQVITEwUKoKBi7ydnR12gxLYberq6oT7qqurKUN9uDGCJxjp6elChTDy8vIcdjFsUft8XFddXl5ShvpwIsjJyYnw6rQE7iPswbMmXDfZ5/b391OGNggiyOTkpFAxjNTUVGHJ3dbWJuSlpaVx57JaoCiCXaigoECoIMbc3BxlAVv42b+lcDZfW1ujDO1QFEFwE2RbQUvk5+ezwY1PPCsrSygvLS1Vfc5QwqEIUlxcLFQUnzi2BJ522JfhUc7u7i7drS1ORdbX14XKYhQVFUFMTIzwfWVlJd2pPU5FsIsodR+lwLGiV2sgTkWQ8fFxxYrbR3l5Od2hDy5FcP8QHR2tWHlL4LjZ2NigO/TB5c/TwcHBUnNzM10pI88vUklJCV3pg1u/s7e2tkryGKArEXlSlORWoSudoJZxCg56+Ykrdis8Ebm7u6NM/XCrRfBpy/sSuvpBXhhKQ0NDUlRUFH2jIyTkkqenJ24xWVZWBmdnZ1SqP26LIPKgh4CAAPaTmB7LEGd49G9Oq6urkryTlOSlC31jHP7/v5axkKQ/E5O9NqOelV4AAAAASUVORK5CYII='; // Tu imagen base64 completa
const imageBytes = base64ToArrayBuffer(miImagenBase64.split(',')[1]);
const miImagen = await pdfDoc.embedPng(imageBytes);



/// Convertir los valores en un array de 0s y 1s
const buenoValues = resultados.bueno.split(',').map(item => item.trim());
const naValues = resultados.na.split(',').map(item => item.trim());

// Función para dibujar imágenes basadas en los valores de 0 o 1
const drawImagesForValues = (values: string[], coordinates: { x: number; y: number }[]) => {
  values.forEach((value, index) => {
    if (coordinates[index] && value === '1') { // Si el valor es '1', dibuja la imagen
      const { x, y } = coordinates[index];
      newPage.drawImage(miImagen, { x, y, width: 5, height: 5 });
    }
  });
};

// Coordenadas para los valores de 'bueno'
const buenoCoordinates = [
  { x: 462, y: height - 270 },
  { x: 462, y: height - 282 },
  { x: 462, y: height - 294 },
  { x: 462, y: height - 306 },
  { x: 462, y: height - 318 }
];

// Coordenadas para los valores de 'na'
const naCoordinates = [
  { x: 490, y: height - 270 },
  { x: 490, y: height - 282 },
  { x: 490, y: height - 294 },
  { x: 490, y: height - 306 },
  { x: 490, y: height - 318 }
];

// Dibujar imágenes para los valores de 'bueno'
drawImagesForValues(buenoValues, buenoCoordinates);

// Dibujar imágenes para los valores de 'na'
drawImagesForValues(naValues, naCoordinates);

// Supongamos que tiposArray es un objeto con las propiedades booleanas
const tiposArray = {
  "aislado": "True",
  "contrapeso": "True",
  "horizontal": "False",
  "vertical": "False",
  "delta": "True",
  "malla": "False"
};

// Coordenadas para los tipos
const tipoCoordinates = {
  aislado: { x: 210, y: height - 445 },
  contrapeso: { x: 240, y: height - 445 },
  horizontal: { x: 280, y: height - 445 },
  vertical: { x: 320, y: height - 445 },
  delta: { x: 360, y: height - 445 },
  malla: { x: 400, y: height - 445 }
};

// Función para dibujar imágenes si el valor es True
const drawImagesForBooleans = (obj: any, coordinates: any) => {
  Object.keys(obj).forEach(key => {
    if (coordinates[key] && (obj[key] === "True" || obj[key] === "true")) {  // Verifica si el valor es True
      const { x, y } = coordinates[key];
      newPage.drawImage(miImagen, { x, y, width: 5, height: 5 });
    }
  });
};

// Dibujar imágenes para los valores de tipos filtrados
drawImagesForBooleans(tiposArray, tipoCoordinates);






      // Dibujar pozos a tierra
      drawValuesWithCoordinates(resultados.pozos_a_tierra.split(',').map(item => item.trim()), [
                   { x: 150, y: height - 540 }, //ELECTRODO
                      { x: 75, y: height - 475 }, //SOLDADURA
                            { x: 150, y: height - 460 }, //CONDUCTOR
                              { x: 218, y: height - 495}, //CONECTOR
                                { x: 215, y: height - 525 }, //IDENTIFICACION
        { x: 175, y: height - 595 }, //CAJA DE REGISTRO

                  { x: 330, y: height - 540 }, //ELECTRODO
                          { x: 255, y: height - 475 }, //SOLDADURA
                              { x: 330, y: height - 460 }, //CONDUCTOR
                                { x: 405, y: height - 495}, //CONECTOR
                                   { x: 415, y: height - 525 }, //IDENTIFICACION
                                      { x: 345, y: height - 595 } ,//CAJA DE REGISTRO



                        { x: 520, y: height - 540 }, //ELECTRODO
                           { x: 430, y: height - 475 }, //SOLDADURA
                              { x: 520, y: height - 460 }, //CONDUCTOR
                                 { x: 585, y: height - 495}, //CONECTOR
                                  { x: 595, y: height - 525 }, //IDENTIFICACION
                                     { x: 555, y: height - 595 } ,//CAJA DE REGISTRO

                        { x: 690, y: height - 540 }, //ELECTRODO
                          { x: 615, y: height - 475 }, //SOLDADURA
                              { x: 690, y: height - 460 }, //CONDUCTOR
                                  { x: 768, y: height - 495}, //CONECTOR
                                    { x: 778, y: height - 525 }, //IDENTIFICACION
                                       { x: 715, y: height - 595 } //CAJA DE REGISTRO
      ]);

      // Dibujar barras equipotenciales
      drawValuesWithCoordinates(resultados.barras_equipotenciales.split(',').map(item => item.trim()), [
        { x: 172, y: height - 655 },
        { x: 150, y: height - 700 },
        { x: 180, y: height - 780 },

        { x: 350, y: height - 785 },
        { x: 290, y: height - 645 },

        { x: 390, y: height - 650 }, //descolorifo
        { x: 550, y: height - 680 },  //flojo
        { x: 580, y: height - 650 }, //sulfatado
        { x: 720, y: height - 645 }, //faltante
        { x:700, y: height - 740 }, //oxidado

        { x: 705, y: height - 780 }, //buen estadp
        { x: 600, y: height - 775 },//suelto
        { x: 540, y: height - 760 },//roto
        // Agrega más coordenadas según sea necesario
      ]);


      // Dibujar cerco perimétrico
      drawValuesWithCoordinates(resultados.cerco_perimetrico.split(',').map(item => item.trim()), [
        { x: 368, y: height - 840 },
        { x: 220, y: height - 840 },
        { x: 185, y: height - 910 },
        { x: 460, y: height - 840 },
        { x: 500, y: height - 935 },
        { x: 700, y: height - 835 },
        { x: 710, y: height - 875 }
      ]);

      // Dibujar transformadores
      drawValuesWithCoordinates(resultados.transformadores.split(',').map(item => item.trim()), [
        { x: 460, y: height - 1000 },
        { x: 225, y: height - 1000 },
        { x: 229, y: height - 1050 },
        { x: 185, y: height - 1085 }
      ]);

      // Dibujar observaciones de aviso
      drawValuesWithCoordinates(resultados.observacion_aviso.split(',').map(item => item.trim()), [
        { x: 110, y: height - 1145 },
        { x: 110, y: height - 1164 },
        { x: 110, y: height - 1181 }
      ]);

      drawValuesWithCoordinates(resultados.aviso.split(',').map(item => item.trim()), [
        { x: 745, y: height - 1145 },
        { x: 745, y: height - 1164 },
        { x: 745, y: height - 1181 }
      ]);


      function base64ToArrayBuffer(base64: string) {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
      }


      // Guardar y devolver el PDF modificado
      const modifiedPdfBytes = await pdfDoc.save();
      return new Blob([modifiedPdfBytes], { type: 'application/pdf' });
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      throw error;
    }
  }


}

