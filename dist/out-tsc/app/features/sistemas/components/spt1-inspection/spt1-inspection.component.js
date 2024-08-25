import { __decorate } from "tslib";
import { Component } from '@angular/core';
import * as ExcelJS from 'exceljs';
import * as XLSX from 'xlsx';
import { SharedModule } from '../../../../shared/shared.module';
let Spt1InspectionComponent = class Spt1InspectionComponent {
    async onFileChange(event) {
        const file = event.target.files[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            if (!e.target || !e.target.result)
                return;
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            if (!worksheet)
                return;
            const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            this.renderTable(excelData);
            await this.processImages(file);
        };
        reader.readAsArrayBuffer(file);
    }
    renderTable(data) {
        const table = document.getElementById('excelTable');
        if (!table)
            return;
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
                }
                else if (this.isDropdownCell(cell)) {
                    console.log('Detected dropdown cell:', cell);
                    const select = document.createElement('select');
                    const options = this.getDropdownOptions(cell);
                    options.forEach((option) => {
                        const optionElement = document.createElement('option');
                        optionElement.value = option;
                        optionElement.text = option;
                        select.appendChild(optionElement);
                    });
                    td.appendChild(select);
                    console.log('Dropdown appended:', select);
                }
                else {
                    td.innerText = cell ? cell : '';
                }
            });
        });
    }
    isDropdownCell(cell) {
        // Detecta cualquier celda que contenga comas, asumiendo que es una lista desplegable.
        return typeof cell === 'string' && cell.includes(',');
    }
    getDropdownOptions(cell) {
        // Divide la celda en opciones separadas por comas.
        return cell.split(',').map((option) => option.trim());
    }
    async processImages(file) {
        const workbook = new ExcelJS.Workbook();
        const buffer = await file.arrayBuffer();
        await workbook.xlsx.load(buffer);
        const worksheet = workbook.getWorksheet(1);
        if (!worksheet)
            return;
        const images = worksheet.getImages();
        console.log('Images found:', images); // Verificar si las imágenes están siendo detectadas
        const imagesContainer = document.createElement('div');
        for (const image of images) {
            const imageId = Number(image.imageId);
            const imageData = workbook.getImage(imageId);
            if (!imageData) {
                console.log(`No image data found for imageId: ${imageId}`);
            }
            else {
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
            }
            else {
                console.log('No image data found for imageId:', imageId);
            }
        }
        const table = document.getElementById('excelTable');
        if (table) {
            const imagesRow = table.insertRow();
            const imagesCell = imagesRow.insertCell();
            imagesCell.colSpan = table.rows[0]?.cells.length || 1;
            imagesCell.appendChild(imagesContainer);
        }
    }
    arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        const binary = Array.from(bytes).map(byte => String.fromCharCode(byte)).join('');
        return window.btoa(binary);
    }
    getImageExtension(mime) {
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
    }
};
Spt1InspectionComponent = __decorate([
    Component({
        selector: 'app-spt1-inspection',
        standalone: true,
        imports: [SharedModule],
        templateUrl: './spt1-inspection.component.html',
        styleUrl: './spt1-inspection.component.css'
    })
], Spt1InspectionComponent);
export { Spt1InspectionComponent };
//# sourceMappingURL=spt1-inspection.component.js.map