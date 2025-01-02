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

      this.transformadores['1371-TX-104'] = {
        nombre: '1371-TX-104',
        imagen: ['./assets/pdf/pm1/MINAS/1.png'],
        form1: {
          titulo: 'Formulario 1',
          items: [
            { label: 'Tapa de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapón superior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válv. Alivio de Presión', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Manovacuómetro / Valor de testigo', valores: ['', ''] },
            { label: 'Radiadores Oblea con bridas desmontable', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapon inferior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Monitor digital temperatura devanado / Valor de testigo', valores: ['', ''] },
            { label: 'Monitor digital temperatura aceite / Valor de testigo', valores: ['', ''] },
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
      // ACID UNLOADING_SS-307
      this.transformadores['3563-TX-320'] = {
        nombre: '3563-TX-320',
        imagen: ['./assets/pdf/pm1/ACID UNLOADING_SS-307/3563-TX-320_1.png'],
        form1: {
          titulo: 'Formulario 1',
          items: [
            { label: 'Relé de presión súbita', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Manovacuómetro / Valor de testigo', valores: ['', ''] },
            { label: 'Ingreso para sonda de termómetro', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Termómetro de devanado / Valor de testigo', valores: ['', ''] },
            { label: 'Placa de identificación', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Caja conexiones auxiliares', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válv. Drenaje/Muestreo', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
        form2: {
          titulo: 'Formulario 2',
          items: [
            { label: 'Termómetro de aceite / Valor de testigo', valores: ['', ''] },
            { label: 'Tapa de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Caja de de TC — Imagen térmica', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa de Inspección lado secundario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa ingreso de cables lado secundario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa de inspección lateral lado secundario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Indic. magnético nivel de aceite', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Terminal puesta a tierra', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
        imagen2: ['./assets/pdf/pm1/ACID UNLOADING_SS-307/3563-TX-320_2.png'],
        form3: {
          titulo: 'Formulario 3',
          items: [
            { label: 'Válv. Alivio de presión', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Superior de radiador desmontable', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapón superior Rad', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válv. Llenado de gas N', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válv. Llenado de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Radiadores Oblea con bridas', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapón Inferior Rad', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
        form4: {
          titulo: 'Formulario 4',
          items: [
            { label: 'Accionamiento dc conmutador S/T', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa de Inspección parte activa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa de inspección lateral lado primario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa de Inspección lado primario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa ingreso de cables lado primario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válv. Inferior de radiador desmontable', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
      };
      //ADMINISTRATION_SS-402
      this.transformadores['4372-TX-402'] = {
        nombre: '4372-TX-402',
        imagen: ['./assets/pdf/pm1/ADMINISTRATION_SS-402/4372-TX-402_1.png'],
        form1: {
          titulo: 'Formulario 1',
          items: [
            { label: 'Relé de presión súbita', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válv. Alivio de presión', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa de inspección lado secundario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Caja conexiones auxiliares', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa ingreso de cables lado secundario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Caja de pase de TC— imagen térmica', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
        form2: {
          titulo: 'Formulario 2',
          items: [
            { label: 'Ingreso para sonda de termómetro', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa de inspección parte activa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válv. Llenado de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válv. Llenado de gas N.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válv. Superior de radiador desmontable', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válv. Inferior de radiador desmontable', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
        imagen2: ['./assets/pdf/pm1/ADMINISTRATION_SS-402/4372-TX-402_2.png'],
        form3: {
          titulo: 'Formulario 3',
          items: [
            { label: 'Accionamiento de conmutador S/T', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa de inspección lado primario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Terminal puesta a tierra', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa ingreso de cables lado primario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
        form4: {
          titulo: 'Formulario 4',
          items: [
            { label: 'Tapa de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Manovacuómetro / Valor de testigo', valores: ['', ''] },
            { label: 'Termómetro de devanado / Valor de testigo', valores: ['', ''] },
            { label: 'Placa de identificación', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Indic. magnético nivel de aceite', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Radiadores Oblea con bridas', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapón inferior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapón superior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
      };

      //CHANCADO_FINO_OXIDOS
      this.transformadores['3562-TX-304'] = {
        nombre: '3562-TX-304',
        imagen: ['./assets/pdf/pm1/CHANCADO_FINO_OXIDOS/3562-TX-304_1.png'],
        form1: {
          titulo: 'Formulario 1',
          items: [
            { label: 'Válv. Alivio de presión', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapón superior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Radiadores Oblea con bridas', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Manovacuómetro / Valor de testigo', valores: ['', ''] },
            { label: 'Tapón interior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Termómetro de devanado / Valor de testigo', valores: ['', ''] },
            { label: 'Termómetro de aceite / Valor de testigo', valores: ['', ''] },
            { label: 'Caja conexiones auxiliares', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
        form2: {
          titulo: 'Formulario 2',
          items: [
            { label: 'Indic. magnético nivel de aceite', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Motoventilador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válv. drenaje tanque conservador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Grapas Seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa ingreso de cables lado secundario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Caja de pase de TC — Imagen térmica', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Placa de identificación', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válv. Drenaje / Muestreo tipo gaveta', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
        imagen2: ['./assets/pdf/pm1/CHANCADO_FINO_OXIDOS/3562-TX-304_2.png'],
        form3: {
          titulo: 'Formulario 3',
          items: [
            { label: 'Válv. Llenado tanque conservador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tanque conservador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Relé detector de gas - Buchholz', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa de la cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Registrador de Impacto', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa de Inspección parte activa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
        form4: {
          titulo: 'Formulario 4',
          items: [
            { label: 'Guarda resistencia puesta a tierra', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válv. Llenado de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa ingreso de cables lado primario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Terminal puesta a tierra', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Accionamiento de conmutador S/T', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
      };


      this.transformadores['3562-TX-305'] = {
        nombre: '3562-TX-305',
        imagen: ['./assets/pdf/pm1/CHANCADO_FINO_OXIDOS/3562-TX-305_1.png'],
        form1: {
          titulo: 'Formulario 1',
          items: [
            { label: 'Tapa de inspección parte activa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Relé de presión súbita', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Manovacuómetro / Valor de testigo', valores: ['', ''] },
            { label: 'Indic. magnético nivel de aceite', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Termómetro de aceite / Valor de testigo', valores: ['', ''] },
            { label: 'Ingreso para sonda de termómetro', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Termómetro de devanado / Valor de testigo', valores: ['', ''] },
            { label: 'Válv. Drenaje / Muestreo', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
        form2: {
          titulo: 'Formulario 2',
          items: [
            { label: 'Caja de pase de TC - Imagen térmica', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Placa de identificación', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa ingreso de cables lado secundario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Caja conexiones auxiliares', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Terminal puesta a tierra', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
        imagen2: ['./assets/pdf/pm1/CHANCADO_FINO_OXIDOS/3562-TX-305_2.png'],
        form3: {
          titulo: 'Formulario 3',
          items: [
            { label: 'Tapa de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Accionamiento de conmutador S/T', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válv. Alivio de presión', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapón superior Rad', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válv. Llenado de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapón inferior Rad', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válv. Superior de radiador desmontable', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
        form4: {
          titulo: 'Formulario 4',
          items: [
            { label: 'Válv. Llenado de gas N', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa ingreso de cables lado primario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válv. Inferior de radiador desmontable', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
      };

      //CHANCADO_FINO_SULFUROS
      this.transformadores['2372-TX-204'] = {
        nombre: '2372-TX-204',
        imagen: ['./assets/pdf/pm1/CHANCADO_FINO_SULFUROS/2372-TX-204_1.png'],
        form1: {
          titulo: 'Formulario 1',
          items: [
            { label: 'Válv. Llenado tanque conservador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Guarda resistencia puesta a tierra', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válv. Alivio de presión', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa ingreso de cables lado primario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Terminal Puesta a tierra', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
        form2: {
          titulo: 'Formulario 2',
          items: [
            { label: 'Relé detector de gas - Buchholz', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Indic. magnético nivel de aceite', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Ingreso para sonda de termómetro', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Manovacuómetro', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Caja de pase de TC — Imagen térmica', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Placa de identificación', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Termómetro de aceite', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Termómetro de devanado', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Caja conexiones auxiliares', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
        imagen2: ['./assets/pdf/pm1/CHANCADO_FINO_SULFUROS/2372-TX-204_2.png'],
        form3: {
          titulo: 'Formulario 3',
          items: [
            { label: 'Tapa de Inspección parte activa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tanque conservador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa ingreso de cables lado secundario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Secador de aire - Sílica gel', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válv. Drenaje/Muestreo tipo gaveta', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Terminal Puesta a tierra', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
        form4: {
          titulo: 'Formulario 4',
          items: [
            { label: 'Válvula de abastecimiento', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Accionamiento de conmutador S/T', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válv. Superior de radiador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapón superior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapón inferior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válv. Inferior de radiador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
      };

      this.transformadores['2372-TX-205'] = {
        nombre: '2372-TX-205',
        imagen: ['./assets/pdf/pm1/CHANCADO_FINO_SULFUROS/2372-TX-205_1.png'],
        form1: {
          titulo: 'Formulario 1',
          items: [
            { label: 'Relé de presión súbita', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Manovacuómetro', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Indic. magnético nivel de aceite', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Termómetro de aceite', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Ingreso para sonda de termómetro', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Termómetro de devanado', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válv. Drenaje / Muestreo', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
        form2: {
          titulo: 'Formulario 2',
          items: [
            { label: 'Tapa de Inspección parte activa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Caja de pase de TC — Imagen térmica', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Placa de identificación', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa ingreso de cables lado secundario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Caja conexiones auxiliares', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Terminal Puesta a tierra', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
        imagen2: ['./assets/pdf/pm1/CHANCADO_FINO_SULFUROS/2372-TX-205_2.png'],
        form3: {
          titulo: 'Formulario 3',
          items: [
            { label: 'Tapa de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Accionamiento de conmutador S/T', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válv. Alivio de presión', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapón superior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válv. Llenado de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapón Inferior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válv. Superior de radiador desmontable', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válv. Inferior de radiador desmontable', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
        form4: {
          titulo: 'Formulario 4',
          items: [
            { label: 'Válv. Llenado de gas N.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa ingreso de cables lado primario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
      };



      //CHANCADO_PRIMARIO
      this.transformadores['2371-TX-201'] = {
        nombre: '2371-TX-201',
        imagen: ['./assets/pdf/pm1/CHANCADO_PRIMARIO/2371-TX-201_1.png'],
        form1: {
          titulo: 'Formulario 1',
          items: [
            { label: 'Accionamiento de conmutador S/T', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Ingreso para sonda de termómetro', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Indic. magnético nivel de aceite', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válvula de drenaje / muestreo', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Terminal Puesta a tierra', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
        form2: {
          titulo: 'Formulario 2',
          items: [
            { label: 'Guarda resistencia puesta a tierra', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válv. Llenado de gas N.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Termómetro de aceite', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Manovacuómetro', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Termómetro de devanado', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa ingreso de cables lado primario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Placa de identificación', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Caja conexiones auxiliares', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
        imagen2: ['./assets/pdf/pm1/CHANCADO_PRIMARIO/2371-TX-201_2.png'],
        form3: {
          titulo: 'Formulario 3',
          items: [
            { label: 'Válv. Llenado de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válv. Alivio de presión', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Relé de presión súbita', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válv. Superior de radiador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapón superior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Radiadores Oblea con bridas desmontables', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válv. Inferior de radiador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapón inferior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
        form4: {
          titulo: 'Formulario 4',
          items: [
            { label: 'Tapa de Inspección parte activa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa ingreso de cables lado primario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Terminal Puesta a tierra', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
      };

      this.transformadores['2371-TX-202'] = {
        nombre: '2371-TX-202',
        imagen: ['./assets/pdf/pm1/CHANCADO_PRIMARIO/2371-TX-202_1.png'],
        form1: {
          titulo: 'Formulario 1',
          items: [
            { label: 'Tapa de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Termómetro de aceite', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Ingreso para sonda de termómetro', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Manovacuómetro', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Indic. magnético nivel de aceite', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válvula de drenaje / muestreo', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Terminal Puesta a tierra', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
        form2: {
          titulo: 'Formulario 2',
          items: [
            { label: 'Válv. Llenado de gas N.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Termómetro de devanado', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Placa de identificación', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa ingreso de cables lado secundario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Caja conexiones auxiliares', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
        imagen2: ['./assets/pdf/pm1/CHANCADO_PRIMARIO/2371-TX-202_2.png'],
        form3: {
          titulo: 'Formulario 3',
          items: [
            { label: 'Accionamiento de conmutador S/T', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válv. Alivio de presión', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Relé de presión súbita', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válv. Llenado de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válv. Superior de radiador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapón superior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Radiadores Oblea con bridas desmontables', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapón inferior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
        form4: {
          titulo: 'Formulario 4',
          items: [
            { label: 'Tapa de Inspección parte activa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa ingreso de cables lado primario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válv. Inferior de radiador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
      };


      //CONCENTRADO
      this.transformadores['2374-TX-213'] = {
        nombre: '2374-TX-213',
        imagen: ['./assets/pdf/pm1/CHANCADO_PRIMARIO/2374-TX-213_1.png'],
        form1: {
          titulo: 'Formulario 1',
          items: [
            { label: 'Accionamiento de conmutador S/T', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Relé de presión súbita', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Manovacuómetro / Valor de testigo', valores: ['', ''] },
            { label: 'Indic. Magnético nivel de aceite', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Termómetro de aceite / Valor de testigo', valores: ['', ''] },
            { label: 'Ingreso para sonda de termómetro', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Termómetro de devanado / Valor de testigo', valores: ['', ''] },
          ],
        },
        form2: {
          titulo: 'Formulario 2',
          items: [
            { label: 'Caja de pase de TC — Imagen térmica', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Placa de identificación', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa ingreso de cables lado secundario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Caja conexiones auxiliares', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Terminal Puesta a tierra', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válvula Drenaje/Muestreo', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
        imagen2: ['./assets/pdf/pm1/CHANCADO_PRIMARIO/2374-TX-213_2.png'],
        form3: {
          titulo: 'Formulario 3',
          items: [
            { label: 'Válvula Llenado de gas N.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa de Inspección parte activa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válvula Alivio de presión', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapón superior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Radiadores Oblea con bridas desmontables', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válvula Llenado de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapón Inferior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válvula Inferior de radiador desmontable', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
        form4: {
          titulo: 'Formulario 4',
          items: [
            { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa ingreso de cables lado primario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válvula Superior de radiador desmontable', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
      };


      //ElECTROWINING_SS-308
      this.transformadores['3563-TX-317'] = {
        nombre: '3563-TX-317',
        imagen: ['./assets/pdf/pm1/ElECTROWINING_SS-308/3563-TX-317_1.png'],
        form1: {
          titulo: 'Formulario 1',
          items: [
            { label: 'Tapa de inspección lado primario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Ingreso para sonda de termómetro', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Manovacuómetro / Valor de testigo', valores: ['', ''] },
            { label: 'Tapa de inspección lateral lado primario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapón superior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Termómetro de aceite / Valor de testigo', valores: ['', ''] },
            { label: 'Radiadores Oblea con bridas', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapón inferior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Caja de pase de TC — Imagen térmica', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válvula Drenaje/Muestreo', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Caja conexiones auxiliares', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
        form2: {
          titulo: 'Formulario 2',
          items: [
            { label: 'Relé de presión súbita', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Indic. magnético nivel de aceite', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Termómetro de devanado / Valor de testigo', valores: ['', ''] },
            { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa ingreso de cables lado secundario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Placa de identificación', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
        imagen2: ['./assets/pdf/pm1/ElECTROWINING_SS-308/3563-TX-317_2.png'],
        form3: {
          titulo: 'Formulario 3',
          items: [
            { label: 'Tapa de Inspección lado secundario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válvula Alivio de presión', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válvula Llenado de N.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa de inspección lateral lado primario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válvula Superior de radiador desmontable', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válvula Llenado de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Radiadores Oblea con bridas', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válvula Inferior de radiador desmontable', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Terminal Puesta a tierra', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
        form4: {
          titulo: 'Formulario 4',
          items: [
            { label: 'Accionamiento de conmutador S/T', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa de Inspección parte activa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Grapas Seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa ingreso de cables lado primario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Pernos de anclaje', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
      };


      //MOLIENDA
      this.transformadores['2373-TX-207'] = {
        nombre: '2373-TX-207',
        imagen: ['./assets/pdf/pm1/MOLIENDA/2373-TX-207_1.png'],
        form1: {
          titulo: 'Formulario 1',
          items: [
            { label: 'Guarda resistencia puesta a tierra', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapón superior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa de la cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapón Inferior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Termómetro de devanado / Valor de testigo', valores: ['', ''] },
            { label: 'Termómetro de aceite / Valor de testigo', valores: ['', ''] },
            { label: 'Caja conexiones auxiliares', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
        form2: {
          titulo: 'Formulario 2',
          items: [
            { label: 'Tanque conservador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Motoventilador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Caja de pase de TC — Imagen térmica', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa ingreso de cables lado secundario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Secador de aire - silica gel', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Placa de identificación', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válvula Drenaje / Muestreo tipo gaveta', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
        imagen2: ['./assets/pdf/pm1/MOLIENDA/2373-TX-207_2.png'],
        form3: {
          titulo: 'Formulario 3',
          items: [
            { label: 'Válvula de abastecimiento', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa de Inspección parte activa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válvula Superior de radiador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa ingreso de cables lado primario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Accionamiento de conmutador S/T', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válvula Inferior de radiador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Terminal Puesta a tierra', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
        form4: {
          titulo: 'Formulario 4',
          items: [
            { label: 'Válvula Llenado tanque conservador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Relé detector de gas - Buchholz', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Indicador magnético nivel de aceite', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válvula drenaje tanque conservador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Manovacuómetro / Valor de testigo', valores: ['', ''] },
            { label: 'Válvula Alivio de presión', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Radiadores Oblea con bridas desmontables', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
      };


      this.transformadores['2373-TX-208'] = {
        nombre: '3563-TX-320',
        imagen: ['./assets/pdf/pm1/MOLIENDA/2373-TX-208_1.png'],
        form1: {
          titulo: 'Formulario 1',
          items: [
            { label: 'Accionamiento de conmutador S/T', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Relé de presión súbita', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Manovacuometro / Valor de testigo', valores: ['', ''] },
            { label: 'Indic. magnético nivel de aceite', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Termómetro de aceite / Valor de testigo', valores: ['', ''] },
            { label: 'Ingreso para sonda de termómetro', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Termometro de devanado / Valor de testigo', valores: ['', ''] },
          ],
        },
        form2: {
          titulo: 'Formulario 2',
          items: [
            { label: 'Caja de pase de TC-Imagen térmica', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Placa de identificación', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa ingresa de cables lado secundario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Caja conexiones auxiliares', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Terminal Puesta a tierra', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válv. Drenaje / Muestreo', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
        imagen2: ['./assets/pdf/pm1/MOLIENDA/2373-TX-208_2.png'],
        form3: {
          titulo: 'Formulario 3',
          items: [
            { label: 'Válv. Llenado de gas N.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa de Inspección parte activa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válv Alivio de presión', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapón superior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Radiadores Oblea con bridas desmontables', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válv. Llenado de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapón Inferior Rad', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válv. Inferior de radiador desmontable', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
        form4: {
          titulo: 'Formulario 4',
          items: [
            { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Tapa ingreso de cables lado primario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            { label: 'Válv. Superior de radiador desmontable', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
        },
      };


      //OXIDE_RECLAIM_SS-301
      this.transformadores['3561-TX-301'] = {
        nombre: '3563-TX-320',
        imagen: ['./assets/pdf/pm1/OXIDE_RECLAIM_SS-301/3561-TX-301_1.png'],
        form1: {
            titulo: 'Formulario 1',
            items: [
                { label: 'Tapa de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Accionamiento de conmutador S/T', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapa de Inspección parte activa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Manovacuómetro / Valor de testigo', valores: ['', ''] },
                { label: 'Ingreso para sonda de termómetro', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Termómetro de aceite / Valor de testigo', valores: ['', ''] },
                { label: 'Indic. magnético nivel de aceite', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Termómetro de devanado / Valor de testigo', valores: ['', ''] },
                { label: 'Válvula de drenaje / muestreo', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            ],
        },
        form2: {
            titulo: 'Formulario 2',
            items: [
                { label: 'Válv. Llenado de gas N.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Caja de pase de TC-Imagen térmica', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Placa de identificación', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapa ingreso de cables lado secundario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Caja conexiones auxiliares', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Terminal Puesta a tierra', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            ],
        },
        form3: {
            titulo: 'Formulario 3',
            items: [
                { label: 'Válv. Alivio de presión', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Relé de presión súbita', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Válv. Llenado de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Válv. Superior de radiador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapón superior Rad', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Radiadores Oblea con bridas desmontables', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapón inferior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            ],
        },
        form4: {
            titulo: 'Formulario 4',
            items: [
                { label: 'Guarda resistencia puesta a tierra', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapa ingreso de cables lado primario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Válv. Inferior de radiador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            ],
        },
        imagen2: ['./assets/pdf/pm1/OXIDE_RECLAIM_SS-301/3561-TX-301_2.png'],
    };


    this.transformadores['3561-TX-302'] = {
      nombre: '3563-TX-320',
      imagen: ['./assets/pdf/pm1/OXIDE_RECLAIM_SS-301/3561-TX-302_1.png'],
      form1: {
          titulo: 'Formulario 1',
          items: [
              { label: 'Termómetro de aceite / Valor de testigo', valores: ['', ''] },
              { label: 'Ingreso para sonda de termómetro', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Manovacuómetro / Valor de testigo', valores: ['', ''] },
              { label: 'Indic- magnético nivel de aceite', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Termómetro de devanado / Valor de testigo', valores: ['', ''] },
              { label: 'Válv- Drenaje/Muestreo', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Terminal Puesta a tierra', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
      },
      form2: {
          titulo: 'Formulario 2',
          items: [
              { label: 'Válv. Llenado de gas N,', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Caja de pase de TC-imagen térmica', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'placa de identificación', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Tapa ingreso de cables lado secundario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Caja conexiones auxiliares', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
      },
      form3: {
          titulo: 'Formulario 3',
          items: [
              { label: 'Accionamiento de conmutador S/T', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Válv. Alivio de presión', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Relé de presión súbita', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Tapón superior Rad', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Radiadores Oblea con bridas', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Válv. Llenado de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Tapón Inferior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Válv Superior de radiador desmontable', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
      },
      form4: {
          titulo: 'Formulario 4',
          items: [
              { label: 'Tapa de Inspección parte activa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Tapa de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Tapa ingreso de cables lado primario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Válv. Inferior de radiador desmontable', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
      },
      imagen2: ['./assets/pdf/pm1/OXIDE_RECLAIM_SS-301/3561-TX-302_2.png'],
  };
      //PONDS_SS-303
      this.transformadores['3563-TX-307'] = {
        nombre: '3563-TX-320',
        imagen: ['./assets/pdf/pm1/PONDS_SS-303/3563-TX-307_1.png'],
        form1: {
            titulo: 'Formulario 1',
            items: [
                { label: 'Tapa de Cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Termómetro de aceite / Valor de testigo', valores: ['', ''] },
                { label: 'Ingreso para sonda de termómetro', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Manovacuometro / Valor de testigo', valores: ['', ''] },
                { label: 'Indic. magnético nivel de aceite', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Válvula de drenaje / muestreo', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Terminal Puesta a tierra', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            ],
        },
        form2: {
            titulo: 'Formulario 2',
            items: [
                { label: 'Válv. Llenado de gas N.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Termómetro de devanado / Valor de testigo', valores: ['', ''] },
                { label: 'Placa de identificación', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapa Ingreso de cables lado secundario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Caja conexiones auxiliares', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            ],
        },
        form3: {
            titulo: 'Formulario 3',
            items: [
                { label: 'Accionamiento de conmutador S/T', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Válv. Alivio de presión', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Relé de presión súbita', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Válv. Llenado de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Válv. Superior de radiador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapón superior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Radiadores Oblea con bridas desmontables', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapón inferior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            ],
        },
        form4: {
            titulo: 'Formulario 4',
            items: [
                { label: 'Tapa de Inspección parte activa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapa ingreso de cables lado primario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Válv. Inferior de radiador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            ],
        },
        imagen2: ['./assets/pdf/pm1/PONDS_SS-303/3563-TX-307_2.png'],
    };


      //PUERTO_SS-501
      this.transformadores['5821-TX-501'] = {
        nombre: '3563-TX-320',
        imagen: ['./assets/pdf/pm1/PUERTO_SS-501/5821-TX-501_1.png'],
        form1: {
            titulo: 'Formulario 1',
            items: [
                { label: 'Resistencia puesta a tierra', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Válvula de abastecimiento', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tanque conservador del conmutador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Radiadores con bridas desmontable', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Motoventilador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Secador de aire del conmutador-sílica gel', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Relé de flujo de conmutador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapa de inspección de conmutador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Conmutador bajo carga', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Placa de identificación', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            ],
        },
        form2: {
            titulo: 'Formulario 2',
            items: [
                { label: 'Válvula de regulación de presión', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Indicador magnético nivel de aceite', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Válvula drenaje tanque conservador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapa ingreso de cables lado primario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Válvula drenaje/muestreo', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Secador de aire del transformador-sílica gel', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Monitor digital temperatura devanado', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Monitor digital temperatura de aceite', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Caja conexiones auxiliares', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            ],
        },
        form3: {
            titulo: 'Formulario 3',
            items: [
                { label: 'Válvula llenado del conservador del transformador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tanque conservador del transformador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Indicador magnético nivel de aceite', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Relé detector de gas-Buchholz', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Manovacuómetro / Valor de testigo', valores: ['', ''] },
                { label: 'Válvula alivio de presión', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapón superior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Válvula superior de radiador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapón interior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            ],
        },
        form4: {
            titulo: 'Formulario 4',
            items: [
                { label: 'Válvula llenado del conservador del conmutador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapa de inspección parte activa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Registrador de impacto', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapa de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapa de inspección lado secundario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapa ingreso de cables lado secundario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Terminal puesta a tierra', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Válvula inferior de radiador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            ],
        },
        imagen2: ['./assets/pdf/pm1/PUERTO_SS-501/5821-TX-501_2.png'],
    };


    this.transformadores['5821-TX-502'] = {
      nombre: '3563-TX-320',
      imagen: ['./assets/pdf/pm1/PUERTO_SS-501/5821-TX-502_1.png'],
      form1: {
          titulo: 'Formulario 1',
          items: [
              { label: 'Tapa de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Terminal Puesta a tierra', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Manovacuómetro / Valor de testigo', valores: ['', ''] },
              { label: 'Termómetro de aceite / Valor de testigo', valores: ['', ''] },
              { label: 'Indic. magnético nivel de aceite', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Termómetro de devanado / Valor de testigo', valores: ['', ''] },
              { label: 'Válvula de drenaje / muestreo', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
      },
      form2: {
          titulo: 'Formulario 2',
          items: [
              { label: 'Caja de pase de TC-Imagen térmica', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Placa de identificación', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Tapa ingreso de cables lado secundario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Caja conexiones auxiliares', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
      },
      form3: {
          titulo: 'Formulario 3',
          items: [
              { label: 'Relé de presión súbita', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Válv. Alivio de presión', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Válv. Llenado de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Válv. Superior de radiador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Tapón superior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Radiadores Oblea con bridas desmontables', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Tapón inferior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
      },
      form4: {
          titulo: 'Formulario 4',
          items: [
              { label: 'Accionamiento de conmutador S/T', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Tapa de Inspección parte activa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Válv. Llenado de gas N.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Tapa ingreso de cables lado primario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Válv. Inferior de radiador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
      },
      imagen2: ['./assets/pdf/pm1/PUERTO_SS-501/5821-TX-502_2.png'],
  };


      //RIPIOS_SS-306
      this.transformadores['3566-TX-315'] = {
        nombre: '3563-TX-320',
        imagen: ['./assets/pdf/pm1/RIPIOS_SS-306/566-TX-315_1.png'],
        form1: {
            titulo: 'Formulario 1',
            items: [
                { label: 'Termómetro de aceite / Valor de testigo', valores: ['', ''] },
                { label: 'Ingreso para sonda de termómetro', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Manovacuómetro / Valor de testigo', valores: ['', ''] },
                { label: 'Indic. magnético nivel de aceite', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Termómetro de devanado / Valor de testigo', valores: ['', ''] },
                { label: 'Válv. Drenaje/Muestreo', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Terminal Puesta a tierra', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            ],
        },
        form2: {
            titulo: 'Formulario 2',
            items: [
                { label: 'Válv Llenado de gas N.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Caja de pase de TC-Imagen térmica', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Placa de identificacion', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapa ingreso de cables lado secundario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Caja conexiones auxiliares', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            ],
        },
        form3: {
            titulo: 'Formulario 3',
            items: [
                { label: 'Accionamiento de conmutador S/T', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Válv. Alivio de presión', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Relé de presión súbita', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapón superior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Radiadores Oblea con bridas', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Válv. Llenado de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapón Inferior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Válv. Superior de radiador desmontable', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            ],
        },
        form4: {
            titulo: 'Formulario 4',
            items: [
                { label: 'Tapa de Inspección parte activa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapa de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapa ingreso de cables lado primario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Válv. Inferior de radiador desmontable', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            ],
        },
        imagen2: ['./assets/pdf/pm1/RIPIOS_SS-306/566-TX-315_2.png'],
    };
    this.transformadores['3566-TX-319'] = {
      nombre: '3563-TX-320',
      imagen: ['./assets/pdf/pm1/RIPIOS_SS-306/566-TX-319_1.png'],
      form1: {
          titulo: 'Formulario 1',
          items: [
              { label: 'Guarda resistencia puesta a tierra', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Termómetro de aceite / valor de testigo', valores: ['', ''] },
              { label: 'Ingreso para sonda de termómetro', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Manovacuómetro / Valor de testigo', valores: ['', ''] },
              { label: 'Indic. magnético nivel de aceite', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Termómetro de devanado / Valor de testigo', valores: ['', ''] },
              { label: 'Válv. Drenaje/Muestreo', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
      },
      form2: {
          titulo: 'Formulario 2',
          items: [
              { label: 'Válv. Llenado de gas N.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Tapa de inspección lado secundario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Placa de identificación', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Tapa ingreso de cables lado secundario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Caja conexiones auxiliares', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Terminal Puesta a tierra', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
      },
      form3: {
          titulo: 'Formulario 3',
          items: [
              { label: 'Accionamiento de conmutador 5/T', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Válv. Alivio de presión', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Relé de presión súbita', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Válv. Superior de radiador desmontable', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Tapon superior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Radiadores Oblea con bridas', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Válv. Llenado de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Tapan Inferior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
      },
      form4: {
          titulo: 'Formulario 4',
          items: [
              { label: 'Tapa de inspección de parte activa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Tapa de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Tapa ingreso de cables lado primario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Válv. Inferior de radiador desmontable', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
      },
      imagen2: ['./assets/pdf/pm1/RIPIOS_SS-306/566-TX-319_2.png'],
  };


      //SS-300
      this.transformadores['3564-TX-311'] = {
        nombre: '3563-TX-320',
        imagen: ['./assets/pdf/pm1/SS-300/3564-TX-311_1.png'],
        form1: {
            titulo: 'Formulario 1',
            items: [
                { label: 'Tapa de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Termómetro de aceite / Valor de testigo', valores: ['', ''] },
                { label: 'Ingreso para sonda de termómetro', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Manovacuómetro / Valor de testigo', valores: ['', ''] },
                { label: 'Indic. magnético nivel de aceite', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Válv. de drenaje /muestreo', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Terminal Puesta a tierra', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            ],
        },
        form2: {
            titulo: 'Formulario 2',
            items: [
                { label: 'Válv. Llenado de gas N.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Termómetro de devanado / Valor de testigo', valores: ['', ''] },
                { label: 'Placa de identificación', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapa ingreso de cables lado secundario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Caja conexiones auxiliares', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            ],
        },
        form3: {
            titulo: 'Formulario 3',
            items: [
                { label: 'Accionamiento de conmutador S/T', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Válv. Alivio de presión', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Relé de presión súbita', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Válv. Llenado de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Válv. Superior de radiador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapon superior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Radiadores Oblea Con bridas desmontables', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapón inferior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            ],
        },
        form4: {
            titulo: 'Formulario 4',
            items: [
                { label: 'Tapa de inspección parte activa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapa ingreso de cables lado primario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Valv. Inferior de radiador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            ],
        },
        imagen2: ['./assets/pdf/pm1/SS-300/3564-TX-311_2.png'],
    };


      //TRANSFER_POINT_SS-205
      this.transformadores['2375-TX-215'] = {
        nombre: '3563-TX-320',
        imagen: ['./assets/pdf/pm1/TRANSFER_POINT_SS-205/2375-TX-215_1.png'],
        form1: {
            titulo: 'Formulario 1',
            items: [
                { label: 'Accionamiento de conmutador S/T', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Relé de presión súbita', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Termómetro de aceite / Valor de testigo', valores: ['', ''] },
                { label: 'Tapa de inspección lateral lado primario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Manovacuómetro / Valor de testigo', valores: ['', ''] },
                { label: 'Indic. magnético nivel de aceite', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Termómetro de devanado / Valor de testigo', valores: ['', ''] },
                { label: 'Válv. Drenaje/Muestreo', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Caja conexiones auxiliares', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            ],
        },
        form2: {
            titulo: 'Formulario 2',
            items: [
                { label: 'Caja de pase de TC-Imagen térmica', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Ingreso para sonda de termómetro', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapa ingreso de cables lado secundario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapa de inspección lateral lado secundario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Placa de identificación', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            ],
        },
        form3: {
            titulo: 'Formulario 3',
            items: [
                { label: 'Tapa de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Válv. Alivio de presión', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Válv. Llenado de gas N.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Válv. Superior de radiador desmontable', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapón superior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Radiadores Oblea con bridas desmontables', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Válv. Llenado de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapón Inferior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Válv. Inferior de radiador desmontable', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            ],
        },
        form4: {
            titulo: 'Formulario 4',
            items: [
                { label: 'Tapa de inspección sup Lado secundario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapa de Inspección parte activa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapa de inspección sup lado primario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapa ingreso de cables lado primario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Terminal Puesta a tierra', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            ],
        },
        imagen2: ['./assets/pdf/pm1/TRANSFER_POINT_SS-205/2375-TX-215_2.png'],
    };


      //VATS_SS-305
      this.transformadores['3565-TX-313'] = {
        nombre: '3563-TX-320',
        imagen: ['./assets/pdf/pm1/VATS_SS-305/3565-TX-313_1.png'],
        form1: {
            titulo: 'Formulario 1',
            items: [
                { label: 'Tapa de Inspección parte activa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Relé de presión Súbita', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Manovacuómetro / Valor de testigo', valores: ['', ''] },
                { label: 'Indic. magnético nivel de aceite', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Termómetro de aceite / Valor de testigo', valores: ['', ''] },
                { label: 'Ingreso para sonda de termómetro', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Termómetro de devanado / Valor de testigo', valores: ['', ''] },
                { label: 'Válv. Drenaje / Muestreo', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            ],
        },
        form2: {
            titulo: 'Formulario 2',
            items: [
                { label: 'Caja de pase de TC-Imagen térmica', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Placa de identificación', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapa ingreso de cables lado secundario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Caja conexiones auxiliares', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Terminal Puesta a tierra', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            ],
        },
        imagen2: ['./assets/pdf/pm1/VATS_SS-305/3565-TX-313_2.png'],
        form3: {
            titulo: 'Formulario 3',
            items: [
                { label: 'Tapa de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Accionamiento de conmutador S/T', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Válv. Alivio de presión', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapón superior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Válv. Llenado de gas N.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Válv. Llenado de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapón Inferior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Válv. Superior de radiador desmontable', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            ],
        },
        form4: {
            titulo: 'Formulario 4',
            items: [
                { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapa ingreso de cables lado primario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Válv. inferior de radiador desmontable', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            ],
        },
    };


    this.transformadores['3565-TX-316'] = {
      nombre: '3563-TX-320',
      imagen: ['./assets/pdf/pm1/VATS_SS-305/3565-TX-316_1.png'],
      form1: {
          titulo: 'Formulario 1',
          items: [
              { label: 'Tapa de inspección de parte activa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Válv. Llenado de gas N', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Relé de presión súbita', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Manovacuómetro / Valor de testigo', valores: ['', ''] },
              { label: 'Indic. magnético nivel de aceite', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Termómetro de devanado / Valor de testigo', valores: ['', ''] },
              { label: 'Válv. Drenaje/Muestreo', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
      },
      form2: {
          titulo: 'Formulario 2',
          items: [
              { label: 'Accionamiento de conmutador S/T', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Caja de pase de TC-imagen térmica', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Tapa de inspección de lado secundario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Placa de identificación', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Ingreso para sonda de termómetro', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Termómetro de aceite / Valor de testigo', valores: ['', ''] },
              { label: 'Tapa de ingreso cables lado secundario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Caja conexiones auxiliares', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Terminal puesta a tierra', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
      },
      imagen2: ['./assets/pdf/pm1/VATS_SS-305/3565-TX-316_2.png'],
      form3: {
          titulo: 'Formulario 3',
          items: [
              { label: 'Válv. Llenado de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Válv. Alivio de presión', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Válv. Superior de radiador desmontable', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Tapón superior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Radiadores Oblea con bridas', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Tapón Inferior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
      },
      form4: {
          titulo: 'Formulario 4',
          items: [
              { label: 'Guarda resistencia puesta a tierra', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Tapa de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Tapa ingreso de cables lado primario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
              { label: 'Válv. Inferior de radiador desmontable', opciones: ['Buen estado', 'Mal estado'], valor: '' },
          ],
      },
  };


      //WATERSERVICES_SS-40
      this.transformadores['4310-TX-415'] = {
        nombre: '3563-TX-320',
        imagen: ['./assets/pdf/pm1/WATERSERVICES_SS-407/4310-TX-415_1.png'],
        form1: {
            titulo: 'Formulario 1',
            items: [
                { label: 'Tapa de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Termómetro de aceite / Valor de testigo', valores: ['', ''] },
                { label: 'Ingreso para sonda de termómetro', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Manovacuómetro / valor de testigo', valores: ['', ''] },
                { label: 'Indic. magnético nivel de aceite', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Válvula de drenaje / muestreo', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Terminal Puesta a tierra', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            ],
        },
        form2: {
            titulo: 'Formulario 2',
            items: [
                { label: 'Válv Llenado de gas N.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Caja de pase de TC-Imagen térmica', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Termómetro de devanado / Valor de testigo', valores: ['', ''] },
                { label: 'Placa de identificación', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapa ingreso de cables lado Secundario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Conexiones auxiliares', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            ],
        },
        imagen2: ['./assets/pdf/pm1/WATERSERVICES_SS-407/4310-TX-415_2.png'],
        form3: {
            titulo: 'Formulario 3',
            items: [
                { label: 'Accionamiento de conmutador S/T', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Válv. Alivio de presión', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Relé de presión súbita', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Válv. Llenado de cuba', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Válv. Superior de radiador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapón superior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Radiadores Oblea con bridas desmontables', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapón inferior Rad.', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            ],
        },
        form4: {
            titulo: 'Formulario 4',
            items: [
                { label: 'Tapa de Inspección parte activa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Grapas seguro de tapa', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Tapa ingreso de cables lado primario', opciones: ['Buen estado', 'Mal estado'], valor: '' },
                { label: 'Válv. Inferior de radiador', opciones: ['Buen estado', 'Mal estado'], valor: '' },
            ],
        },
    };








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
