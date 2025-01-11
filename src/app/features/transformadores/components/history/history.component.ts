import { Component } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PM1Service } from 'src/app/features/sistemas/services/pm1.service';
import { TransformadorPM1Service } from 'src/app/features/sistemas/services/transformador-pm1.service';
import { Router } from '@angular/router';
import 'datatables.net';
import 'datatables.net-buttons';
import 'datatables.net-buttons/js/buttons.html5.js';
import 'datatables.net-buttons/js/buttons.print.js';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { PDFDocument, StandardFonts } from 'pdf-lib';
@Component({
  selector: 'app-history',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent {
  transformador: any[] = [];
  listOfDisplayData: any[] = [];
  loading = true;
  pageIndex: number = 1;
  pageSize: number = 7;

  // Variables para filtros por cada columna
  filterSubestacion = '';
  filterUbicacion = '';
  filterTransformador = '';
  filterTipo = '';
  filterMarca = '';
  filterVoltage = '';
  filterPotencia = '';

  constructor(
    private PM1Service: PM1Service,
    private router: Router,
    private transformadorService: TransformadorPM1Service
  ) {}

  ngOnInit(): void {
    this.transformadorService.getTransformadores().subscribe((data) => {
      this.transformador = data;
      this.listOfDisplayData = [...this.transformador]; // Inicializamos la tabla con los datos
      this.loading = false;
    });
  }

  abrirpruebas(transformador: string, subestacion: string, voltage: string, potencia: string): void {
    this.router.navigate(['transformadores/inseccion-pm1'], {
      queryParams: {
        transformador: transformador,
        subestacion: subestacion,
        voltage: voltage,
        potencia: potencia,
      },
    });
  }

  // Método para aplicar todos los filtros
  applyFilters(): void {
    this.listOfDisplayData = this.transformador.filter((item) => {
      return (
        item.subestacion.toLowerCase().includes(this.filterSubestacion.toLowerCase()) &&
        item.ubicacion.toLowerCase().includes(this.filterUbicacion.toLowerCase()) &&
        item.transformador.toLowerCase().includes(this.filterTransformador.toLowerCase()) &&
        item.tipo.toLowerCase().includes(this.filterTipo.toLowerCase()) &&
        item.marca.toLowerCase().includes(this.filterMarca.toLowerCase()) &&
        item.voltage.toString().includes(this.filterVoltage) &&
        item.potencia.toString().includes(this.filterPotencia)
      );
    });
  }
  onPageIndexChange(newPageIndex: number): void {
    this.pageIndex = newPageIndex;
  }

   // Método para exportar a PDF
// Método para exportar a PDF
async exportToPDF(): Promise<void> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // Tamaño A4 (595x842 puntos)
  const { width, height } = page.getSize();

  // Establecer la fuente predeterminada
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Título del documento
  const fontSize = 18;
  const textWidth = font.widthOfTextAtSize('Reporte de Transformadores', fontSize);
  page.drawText('Reporte de Transformadores', {
    x: (width - textWidth) / 2,
    y: height - 50,
    size: fontSize,
    font,
  });

  // Configuración de la tabla
  const startX = 15;
  const startY = height - 100;
  const rowHeight = 20;
  const columnWidths = [80, 130, 80, 80, 70, 80, 80]; // Ajusta el ancho de cada columna

  // Encabezados de la tabla
  const headers = ['Subestación', 'Ubicación', 'Transformador', 'Tipo', 'Marca', 'Voltaje', 'Potencia'];
  headers.forEach((header, index) => {
    page.drawText(header, {
      x: startX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0),
      y: startY,
      size: 10,
      font,
    });
  });

  // Datos de la tabla
  this.listOfDisplayData.forEach((item, rowIndex) => {
    const rowY = startY - (rowIndex + 1) * rowHeight;
    if (rowY < 50) return; // Evitar datos fuera de la página

    const row = [
      item.subestacion,
      item.ubicacion,
      item.transformador,
      item.tipo,
      item.marca,
      item.voltage,
      item.potencia,
    ];

    row.forEach((data, colIndex) => {
      const cellX = startX + columnWidths.slice(0, colIndex).reduce((a, b) => a + b, 0);
      const cellWidth = columnWidths[colIndex];
      const text = String(data);

      // Manejo de texto largo (Ubicación)
      if (colIndex === 1 && text.length > 20) {
        // Divide el texto en líneas si supera el ancho de la columna
        const words = text.split(' ');
        let line = '';
        let lineY = rowY;

        words.forEach((word) => {
          const testLine = line + word + ' ';
          const testWidth = font.widthOfTextAtSize(testLine, 8);
          if (testWidth > cellWidth) {
            // Imprime la línea y pasa a la siguiente
            page.drawText(line.trim(), {
              x: cellX,
              y: lineY,
              size: 8,
              font,
            });
            line = word + ' ';
            lineY -= 10; // Espaciado entre líneas
          } else {
            line = testLine;
          }
        });

        // Imprime la última línea
        if (line) {
          page.drawText(line.trim(), {
            x: cellX,
            y: lineY,
            size: 8,
            font,
          });
        }
      } else {
        // Para columnas normales
        page.drawText(text, {
          x: cellX,
          y: rowY,
          size: 8,
          font,
        });
      }
    });
  });

  // Guardar y descargar el PDF
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  saveAs(blob, 'reporte_transformadores.pdf');
}



   // Método para exportar a Excel
   exportToExcel(): void {
    const worksheet = XLSX.utils.json_to_sheet(this.listOfDisplayData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transformadores');
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'reporte_transformadores.xlsx');
  }

  // Método para imprimir
  printTable(): void {
    const tableContainer = document.getElementById('transformadorTableContainer');
    if (!tableContainer) {
      console.error('No se encontró el contenedor de la tabla.');
      return;
    }
    const printContents = tableContainer.outerHTML;
    const popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin!.document.open();
    popupWin!.document.write(`
      <html>
        <head>
          <title>Imprimir Tabla</title>
          <style>
            table {
              border-collapse: collapse;
              width: 100%;
            }
            th, td {
              border: 1px solid black;
              padding: 8px;
              text-align: left;
            }
          </style>
        </head>
        <body onload="window.print();window.close()">${printContents}</body>
      </html>
    `);
    popupWin!.document.close();
  }


}
