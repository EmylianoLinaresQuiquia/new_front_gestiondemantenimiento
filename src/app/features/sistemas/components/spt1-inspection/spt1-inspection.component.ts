import { Component,OnInit ,Inject, PLATFORM_ID } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
/*import * as ExcelJS from 'exceljs';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import * as XLSX from 'xlsx';
import { SharedModule } from '../../../../shared/shared.module';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { isPlatformBrowser } from '@angular/common';*/


/*interface Cell {
  v: string; // o el tipo adecuado según tus datos
}

// Define el tipo para una fila, que es un array de celdas
type Row = (Cell | string)[];*/
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-spt1-inspection',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './spt1-inspection.component.html',
  styleUrl: './spt1-inspection.component.css'
})
export class Spt1InspectionComponent  {
  /*async onFileChange(event: any): Promise<void> {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e: ProgressEvent<FileReader>) => {
      if (!e.target || !e.target.result) return;

      const data = new Uint8Array(e.target.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      if (!worksheet) return;

      const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
      this.renderTable(excelData);

      await this.processImages(file);
    };
    reader.readAsArrayBuffer(file);
  }
  renderTable(data: any[][]): void {
    const table = document.getElementById('excelTable') as HTMLTableElement;
    if (!table) return;

    table.innerHTML = '';

    data.forEach((row, rowIndex) => {
        const tr = table.insertRow();
        row.forEach((cell, cellIndex) => {
            const td = tr.insertCell();

            console.log(`Row ${rowIndex}, Cell ${cellIndex}:`, cell);

            if (cell === 'TRUE' || cell === 'FALSE') {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = cell === 'TRUE';
                td.appendChild(checkbox);
            } else if (this.isDropdownCell(cell)) {
                console.log('Detected dropdown cell:', cell);
                const select = document.createElement('select');
                const options = this.getDropdownOptions(cell);
                options.forEach((option: string) => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option;
                    optionElement.text = option;
                    select.appendChild(optionElement);
                });
                td.appendChild(select);
                console.log('Dropdown appended:', select);
            } else {
                td.innerText = cell ? cell : '';
            }
        });
    });
}




isDropdownCell(cell: any): boolean {
  // Detecta cualquier celda que contenga comas, asumiendo que es una lista desplegable.
  return typeof cell === 'string' && cell.includes(',');
}

getDropdownOptions(cell: any): string[] {
  // Divide la celda en opciones separadas por comas.
  return cell.split(',').map((option: string) => option.trim());
}


  async processImages(file: File): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const buffer = await file.arrayBuffer();
    await workbook.xlsx.load(buffer);

    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) return;

    const images = worksheet.getImages();
    console.log('Images found:', images); // Verificar si las imágenes están siendo detectadas

    const imagesContainer = document.createElement('div');

    for (const image of images) {
      const imageId = Number(image.imageId);
      const imageData = workbook.getImage(imageId);

      if (!imageData) {
          console.log(`No image data found for imageId: ${imageId}`);
       } else {
          console.log('Image data:', imageData);
      }

      if (imageData && imageData.buffer) {
        const extension = this.getImageExtension(imageData.extension);
        const base64Image = this.arrayBufferToBase64(imageData.buffer);

        console.log(`Image base64 string: data:image/${extension};base64,${base64Image}`);
        const imgElement = document.createElement('img');
        imgElement.src = `data:image/${extension};base64,${base64Image}`;
        imgElement.style.width = '100px'; // Ajustar el tamaño de la imagen
        imgElement.style.height = 'auto'; // Mantener la proporción de la imagen
        imgElement.style.margin = '10px';

        console.log('Image displayed:', imgElement.src); // Verificar si la imagen se está mostrando correctamente

        imagesContainer.appendChild(imgElement);
      } else {
        console.log('No image data found for imageId:', imageId);
      }
    }

    const table = document.getElementById('excelTable') as HTMLTableElement;
    if (table) {
      const imagesRow = table.insertRow();
      const imagesCell = imagesRow.insertCell();
      imagesCell.colSpan = table.rows[0]?.cells.length || 1;
      imagesCell.appendChild(imagesContainer);
    }
  }

  arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    const binary = Array.from(bytes).map(byte => String.fromCharCode(byte)).join('');
    return window.btoa(binary);
  }

  getImageExtension(mime: string): string {
    switch (mime) {
      case 'image/png':
        return 'png';
      case 'image/jpeg':
        return 'jpeg';
      case 'image/gif':
        return 'gif';
      case 'image/bmp':
        return 'bmp';
      default:
        return 'png'; // Default to PNG if unrecognized
    }
  }*/




























  /*sheetData: (string | number)[][] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadExcelTemplate();
  }

  loadExcelTemplate(): void {
    const url = 'assets/Libro1.xlsx';
    this.http.get(url, { responseType: 'arraybuffer' }).subscribe(data => {
      try {
        const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        if (worksheet) {
          const sheetData: (string | number)[][] = [];
          const range = XLSX.utils.decode_range(worksheet['!ref'] || '');

          for (let R = range.s.r; R <= range.e.r; ++R) {
            const row: (string | number)[] = [];
            for (let C = range.s.c; C <= range.e.c; ++C) {
              const cellAddress = { c: C, r: R };
              const cellRef = XLSX.utils.encode_cell(cellAddress);
              const cell = worksheet[cellRef];
              const cellValue = this.getCellValue(cell);

              console.log(`Procesando celda [${R}, ${C}]:`, cell, '->', cellValue);
              row.push(cellValue);
            }
            sheetData.push(row);
          }

          this.sheetData = sheetData;
          console.log('Datos de la hoja convertidos:', this.sheetData);
        } else {
          console.error('La hoja de trabajo no se pudo encontrar o está vacía.');
        }
      } catch (error) {
        console.error('Error al cargar o procesar el archivo .xlsx:', error);
      }
    });
  }

  private getCellValue(cell: any): string | number {
    if (cell === undefined || cell === null) return '';

    if (typeof cell === 'object') {
      if (cell.hasOwnProperty('v')) {
        const cellValue = cell.v;

        // Verifica si el valor es un objeto
        if (typeof cellValue === 'object') {
          return JSON.stringify(cellValue);
        }

        return cellValue;
      } else if (cell.hasOwnProperty('w')) {
        return cell.w;
      } else {
        return JSON.stringify(cell);
      }
    }

    return cell;
  }*/


}
