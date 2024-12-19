import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransformadoresService {
  private transformadores: Record<string, any> = {};



  constructor() {

    //MINAS
    this.transformadores['1371-TX-102'] = {
      nombre: '1371-TX-102',
      imagen: ['./assets/pdf/pm1/MINAS/1.png'],
      form1: {
        titulo: 'Formulario 1',
        items: [
          { label: 'Tapa de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Tapón superior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Válv. Alivio de Presión', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Manovacuómetro ', valores: ['', ''] },
          { label: 'Radiadores Oblea con bridas desmontable', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Tapon inferior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Monitor digital temperatura devanado ', valores: ['', ''] },
          { label: 'Monitor digital temperatura aceite ', valores: ['', ''] },
          { label: 'Caja conexiones auxiliares', opciones: ['Buen estado', 'Mal estado'], valor: '' },
        ]
      },

      form2: {
        titulo: 'Formulario 2',
        items: [
          { label: 'Válvula de abastecimiento', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Tanque conservador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Seguros de tapa, caja bornes L/S', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Placa de identificación', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Tapa ingreso de cables lado secundario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Secador de aire - salica gel', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Terminal Puesta a tierra', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Válv. Drenaje / Muestreo tipo gaveta', opciones: ['Buen estado', 'Mal estado'], valor: '' },
        ]
      },
      form3: {
        titulo: 'Formulario 3',
        items: [
          { label: 'Válv. Llenado tanque conservador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Relé detector de gas - Buchholz', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Tapa de Inspección parte activa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Seguros de tapa, caja de bornes L/P', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Tapa irgreso de cables lado primario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Accionamiento de conmutador S/T', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Terminal Puesta a tierra', opciones: ['Buen estado', 'Mal estado'], valor: '' },
        ]
      },
      form4: {
        titulo: 'Formulario 4',
        items: [
          { label: 'Relé de presión súbita', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Indic. magnético nivel de aceite', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Válv. drenaje tanque conservador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Caja de pase de TC — Imagen térmica', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Válv. Superior de radiador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Válv. inferior de radiador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Motoventilador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
        ]
      },
      imagen2: ['./assets/pdf/pm1/MINAS/2.png']
    };


    this.transformadores['1371-TX-103'] = {
      nombre: '1371-TX-103',
      imagen: ['./assets/pdf/pm1/MINAS/1.png'],
      form1: {
        titulo: 'Formulario 1',
        items: [
          { label: 'Tapa de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Tapón superior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Válv. Alivio de Presión', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Manovacuómetro ', valores: ['', ''] },
          { label: 'Radiadores Oblea con bridas desmontable', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Tapon inferior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Monitor digital temperatura devanado ', valores: ['', ''] },
          { label: 'Monitor digital temperatura aceite ', valores: ['', ''] },
          { label: 'Caja conexiones auxiliares', opciones: ['Buen estado', 'Mal estado'], valor: '' },
        ]
      },

      form2: {
        titulo: 'Formulario 2',
        items: [
          { label: 'Válvula de abastecimiento', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Tanque conservador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Seguros de tapa, caja bornes L/S', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Placa de identificación', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Tapa ingreso de cables lado secundario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Secador de aire - salica gel', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Terminal Puesta a tierra', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Válv. Drenaje / Muestreo tipo gaveta', opciones: ['Buen estado', 'Mal estado'], valor: '' },
        ]
      },
      form3: {
        titulo: 'Formulario 3',
        items: [
          { label: 'Válv. Llenado tanque conservador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Relé detector de gas - Buchholz', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Tapa de Inspección parte activa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Seguros de tapa, caja de bornes L/P', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Tapa irgreso de cables lado primario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Accionamiento de conmutador S/T', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Terminal Puesta a tierra', opciones: ['Buen estado', 'Mal estado'], valor: '' },
        ]
      },
      form4: {
        titulo: 'Formulario 4',
        items: [
          { label: 'Relé de presión súbita', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Indic. magnético nivel de aceite', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Válv. drenaje tanque conservador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Caja de pase de TC — Imagen térmica', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Válv. Superior de radiador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Válv. inferior de radiador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          { label: 'Motoventilador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
        ]
      },
      imagen2: ['./assets/pdf/pm1/MINAS/2.png']


  }
}

  // Obtener un transformador por ID
  getTransformador(id: string): any {
    return this.transformadores[id];
  }

  // Agregar un nuevo transformador
  addTransformador(id: string, transformador: any): void {
    this.transformadores[id] = transformador;
  }

  // Actualizar un transformador existente
  updateTransformador(id: string, updatedData: any): void {
    if (this.transformadores[id]) {
      this.transformadores[id] = { ...this.transformadores[id], ...updatedData };
    }
  }

  // Eliminar un transformador
  deleteTransformador(id: string): void {
    delete this.transformadores[id];
  }

  // Obtener todos los transformadores
  getAllTransformadores(): Record<string, any> {
    return this.transformadores;
  }
}
