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

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../interface/usuario';


import { Subestacion } from '../../interface/subestacion';
import { Spt1 } from '../../interface/spt1';
import { Seguridadobservacion } from '../../interface/seguridadobservacion';
import { BarraequiAi } from '../../interface/barraequi-ai';
import { BarraequiNoAi } from '../../interface/barraequi-no-ai';
import { CercopAi } from '../../interface/cercop-ai';
import { CercopNoAi } from '../../interface/cercop-no-ai';
import { TransformadorNoAi } from '../../interface/transformador-no-ai';
import { Recomendacion } from '../../interface/recomendacion';
import { Tipostp } from '../../interface/tipostp';
import { Notificacion } from '../../interface/notificacion';
import { Pat1spt1 } from '../../interface/pat1spt1';
import { Pat2spt1 } from '../../interface/pat2spt1';
import { Pat3spt1 } from '../../interface/pat3spt1';
import { Pat4spt1 } from '../../interface/pat4spt1';


import { SubestacionService } from '../../services/subestacion.service';
import { Spt1Service } from '../../services/spt1.service';
import { SeguridadobservacionService } from '../../services/seguridadobservacion.service';
import { BarraequiAiService } from '../../services/barraequi-ai.service';
import { BarraequiNoAiService } from '../../services/barraequi-no-ai.service';
import { CercopAiService } from '../../services/cercop-ai.service';
import { CercopNoAiService } from '../../services/cercop-no-ai.service';
import { TransformadorNoAiService } from '../../services/transformador-no-ai.service';
import { RecomendacionService } from '../../services/recomendacion.service';
import { TipostpService } from '../../services/tipostp.service';
import { NotificacionService } from '../../services/notificacion.service';
import { AuthServiceService } from '../../services/auth-service.service';
import { Pat1spt1Service } from '../../services/pat1spt1.service';
import { Pat2spt1Service } from '../../services/pat2spt1.service';
import { Pat3spt1Service } from '../../services/pat3spt1.service';
import { Pat4spt1Service } from '../../services/pat4spt1.service';
//import { PdfGeneratorPlanoService } from '../../services/pdf-generator-plano.service';

//import { PdfViewerDialogComponent } from '../../transformadores/pm1/pdf-viewer-dialog/pdf-viewer-dialog.component';
//import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from '../../services/alert.service';
import { ActivatedRoute } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ChangeDetectorRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-spt1-inspection',
  standalone: true,
  imports: [SharedModule],
  providers: [
    NzModalService, // Ensure the service is provided here
  ],
  templateUrl: './spt1-inspection.component.html',
  styleUrl: './spt1-inspection.component.css'
})
export class Spt1InspectionComponent  {

  seguridad_observacion: number = 0;
    pozo_t_noAi: number = 0;
    pozo_t_Ai: number = 0;
    barra_e_noAi: number = 0;
    barra_e_Ai: number = 0;
    cerco_p_noAi: number = 0;
    cerco_p_Ai: number = 0;
    transformador_noAi: number = 0;
    recomendacion_lote_id: number = 0;
    id_tipostp: number = 0;
    pat1_spt1: number = 0;
    pat2_spt1: number = 0;
    pat3_spt1: number = 0;
    pat4_spt1: number = 0;
    id_spt1: number = 0;
    userId?: number;
    images: File[] = [];
    subestacion: Subestacion | null = null;
    tagSubestacion: string = '';
    ot: string = '';
    fecha: string = '';
    ubicacion: string = '';
    plano: string = '';
    fechaplano: string = '';
    versio: string = '';
    inicio: string = '';
    fin: string = '';

    marca: string = '';
    nserie: string = '';
    modelo: string = '';
    frecuencia: string = '';
    precision: string = '';

    usuarios: Usuario[] = [];
    correoSeleccionado: string = '';
    fotocheckSeleccionado: number | null = null;
    rutaFirmaSeleccionada: string = '';

    correoSeleccionado1: string = '';
    fotocheckSeleccionado1: number | null = null;
    files: File[] = [];
    inputValues: number[] = [];
    cantidad_spt: number | null = null;
    colorSeleccionado: string = '';

    check1: boolean = false;
    check2: boolean = false;
    observacion1: string = '';
    check3: boolean = false;
    check4: boolean = false;
    observacion2: string = '';
    check5: boolean = false;
    check6: boolean = false;
    observacion3: string = '';
    check7: boolean = false;
    check8: boolean = false;
    observacion4: string = '';
    check9: boolean = false;
    check10: boolean = false;
    observacion5: string = '';

    aislado: boolean = false;
    contrapeso: boolean = false;
    horizontal: boolean = false;
    vertical: boolean = false;
    delta: boolean = false;
    malla: boolean = false;

    observacion6: string = '';
    observacion7: string = '';
    observacion8: string = '';
    aviso6: string = '';
    aviso7: string = '';
    aviso8: string = '';
    patValues: string[] = [];
    userEmail?: string;
    //items: MenuItem[] | undefined;

    constructor(
      private sanitizer: DomSanitizer,
      private usuarioService: UsuarioService,
      private subestacionService: SubestacionService,
      private Spt1Service: Spt1Service,
      private SeguridadobservacionService: SeguridadobservacionService,
      private BarraequiNoAiService: BarraequiNoAiService,
      private BarraequiAiService: BarraequiAiService,
      private CercopNoAiService: CercopNoAiService,
      private CercopAiService: CercopAiService,
      private TransformadorNoAiService: TransformadorNoAiService,
      private RecomendacionService: RecomendacionService,

      private notificacionService: NotificacionService,
      private authService: AuthServiceService,
      private TipostpService: TipostpService,
      //private PdfGeneratorPlanoService: PdfGeneratorPlanoService,
      private Pat1spt1Service: Pat1spt1Service,
      private Pat2spt2Service: Pat2spt1Service,
      private Pat3spt1Service: Pat3spt1Service,
      private Pat4spt1Service: Pat4spt1Service,
      //public dialog: MatDialog,
      private alertservice: AlertService,
      private route: ActivatedRoute,
      private messageService:NzMessageService,
      private notificationService:NzNotificationService,
      private modal: NzModalService
    ) {
      this.initializeOptions(48);
    }

    ngOnInit(): void {
      /*this.items = [
        {
          icon: 'pi pi-upload',
          command: () => {
            this.guardarDatos();
          }
        }
      ];*/
      this.route.queryParams.subscribe(params => {
        this.tagSubestacion = params['tag'] || '';
        this.ubicacion = params['ubicacion'] || '';
        this.plano = params['plano'] || '';
        this.cantidad_spt = params['cantidad_spt'] ? +params['cantidad_spt'] : null;
      });

      this.subestacionService.getSubestacionData().subscribe((data) => {
        if (data) {
          this.tagSubestacion = data.tag_subestacion || '';
          this.ubicacion = data.ubicacion || '';
          this.plano = data.plano || '';
          this.fechaplano = data.fecha || '';
          this.versio = data.versio || '';
          this.cantidad_spt = data.cantidad_spt || null;
          this.files = [];
        }
      });

      this.usuarioService.getUsers().subscribe(
        (usuarios: Usuario[]) => {
          this.usuarios = usuarios;
          if (this.usuarios.length === 0) {
            console.error('No se obtuvieron usuarios.');
          }
        },
        (error: any) => {
          console.error('Error al obtener la lista de usuarios:', error);
        }
      );
    }

    getRange(): number[] {
      return Array.from({ length: this.cantidad_spt ?? 0 }, (_, index) => index);
    }

    getSelectClass(selectedOption: string): string {
      return selectedOption === 'Buen Estado' ? 'select-green' : 'select-red';
    }

    onSelectChange(index: number, event: Event): void {
      const select = event.target as HTMLSelectElement;
      this.patValues[index] = select.value;
      console.log(`Valor seleccionado para pat${index + 1}:`, select.value);
    }

    idusuario = 0;
    seleccionarParticipante(event: any, tipoCargo: string): void {
      const fotocheckSeleccionado = parseInt(event.target.value, 10);
      const usuarioSeleccionado = this.usuarios.find(usuario => usuario.fotocheck === fotocheckSeleccionado);

      if (usuarioSeleccionado) {
        console.log('Usuario seleccionado:', usuarioSeleccionado);
        this.idusuario = usuarioSeleccionado.idUsuario;
      }

      if (usuarioSeleccionado) {
        if (tipoCargo === 'TECNICO' && usuarioSeleccionado.cargo === 'TECNICO') {
          this.rutaFirmaSeleccionada = usuarioSeleccionado.firma || '';
          this.correoSeleccionado = usuarioSeleccionado.usuario || '';
        } else if (tipoCargo === 'SUPERVISOR' && usuarioSeleccionado.cargo === 'SUPERVISOR') {
          this.correoSeleccionado1 = usuarioSeleccionado.usuario || '';
        } else {
          console.error(`Error: Operación válida solo para ${tipoCargo.toLowerCase()}s, cargo actual: ${usuarioSeleccionado.cargo}`);
        }
      }
    }

    selectedOptions: string[] = ['', '', ''];
    colorSeleccionadoClasses: string[] = ['', '', ''];
    colorSeleccionadoClass: string = '';
    colorSeleccionadoClass1: string = '';
    selectedOption: string = '';
    selectedOption1: string = '';
    options: { [key: string]: { selected: string, colorClass: string } } = {};

    initializeOptions(count: number): void {
      this.options['selectedOption'] = { selected: '', colorClass: '' };

      for (let i = 1; i < count; i++) {
        this.options[`selectedOption${i}`] = { selected: '', colorClass: '' };
      }
    }

    getOption(key: string): { selected: string, colorClass: string } {
      return this.options[key] || { selected: '', colorClass: '' };
    }

    /*onGenerarPdfButtonClick(): void {
      this.subestacionService.getPdfBySubestacion(this.tagSubestacion).subscribe(
        (pdfBlob: Blob) => {
          const blobUrl = URL.createObjectURL(pdfBlob);
          this.dialog.open(PdfViewerDialogComponent, {
            data: { pdfSrc: blobUrl },
            width: '80%',
            height: '90%'
          });
        },
        error => {
          console.error('Error inesperado', error);
          this.alertservice.showAlert('No se encontró el Plano.', 'error');
        }
      );
    }*/





      guardarDatos(): void {
        this.modal.confirm({
          nzTitle: 'Confirmación',
          nzContent: '¿Estás seguro de que quieres guardar los datos?',
          nzOnOk: async () => {
            this.messageService.loading('Evaluando los datos, por favor espera...', { nzDuration: 0 });

                try {
                    const observaciones: Seguridadobservacion[] = [
                        { bueno: this.check1, na: this.check2, observacion: this.observacion1 },
                        { bueno: this.check3, na: this.check4, observacion: this.observacion2 },
                        { bueno: this.check5, na: this.check6, observacion: this.observacion3 },
                        { bueno: this.check7, na: this.check8, observacion: this.observacion4 },
                        { bueno: this.check9, na: this.check10, observacion: this.observacion5 }
                        // ...resto de tus observaciones...
                    ];

                    // Primero insertar observaciones
                    this.SeguridadobservacionService.insertarCincoObservaciones(observaciones).subscribe(responseObservacion => {
                        this.seguridad_observacion = responseObservacion.lote_id;

                        const transformadores: TransformadorNoAi[] = [
                            { seleccionado: this.options['selectedOption44'].selected },
                            { seleccionado: this.options['selectedOption45'].selected },
                            { seleccionado: this.options['selectedOption46'].selected },
                            { seleccionado: this.options['selectedOption47'].selected },
                        ];

                        this.TransformadorNoAiService.insertarTransformadorNoAi(transformadores).subscribe(responseTransformador => {
                            this.transformador_noAi = responseTransformador.lote_id;

                            const cercos: CercopAi[] = [
                                { seleccionado: this.options['selectedOption41'].selected },
                                { seleccionado: this.options['selectedOption42'].selected },
                                { seleccionado: this.options['selectedOption43'].selected },
                            ];

                            this.CercopAiService.insertarCercoPerimetricoAi(cercos).subscribe(responseCercos => {
                                this.cerco_p_Ai = responseCercos.lote_id;

                                const cercosnoAi: CercopNoAi[] = [
                                    { seleccionado: this.options['selectedOption37'].selected },
                                    { seleccionado: this.options['selectedOption38'].selected },
                                    { seleccionado: this.options['selectedOption39'].selected },
                                    { seleccionado: this.options['selectedOption40'].selected },
                                ];

                                this.CercopNoAiService.insertarCercoPerimetricoNoAi(cercosnoAi).subscribe(responseCercosNoAi => {
                                    this.cerco_p_noAi = responseCercosNoAi.lote_id;

                                    const barraeqAi: BarraequiAi[] = [
                                        { seleccionado: this.options['selectedOption30'].selected },
                                        { seleccionado: this.options['selectedOption31'].selected },
                                        { seleccionado: this.options['selectedOption32'].selected },
                                        { seleccionado: this.options['selectedOption33'].selected },
                                        { seleccionado: this.options['selectedOption34'].selected },
                                        { seleccionado: this.options['selectedOption35'].selected },
                                        { seleccionado: this.options['selectedOption36'].selected },
                                    ];

                                    this.BarraequiAiService.insertarBarraEquipotencialAi(barraeqAi).subscribe(responseBarraAi => {
                                        this.barra_e_Ai = responseBarraAi.lote_id;

                                        const barraeqnoAi: BarraequiNoAi[] = [
                                            { seleccionado: this.options['selectedOption24'].selected },
                                            { seleccionado: this.options['selectedOption25'].selected },
                                            { seleccionado: this.options['selectedOption26'].selected },
                                            { seleccionado: this.options['selectedOption27'].selected },
                                            { seleccionado: this.options['selectedOption28'].selected },
                                            { seleccionado: this.options['selectedOption29'].selected },
                                        ];

                                        this.BarraequiNoAiService.insertarBarraEquipotencialNoAi(barraeqnoAi).subscribe(responseBarraNoAi => {
                                            this.barra_e_noAi = responseBarraNoAi.lote_id;

                                            const TipoSpt: Tipostp = {
                                                aislado: this.aislado,
                                                contrapeso: this.contrapeso,
                                                horizontal: this.horizontal,
                                                vertical: this.vertical,
                                                delta: this.delta,
                                                malla: this.malla
                                            };

                                            this.TipostpService.insertarTipoSpt(TipoSpt).subscribe(responseTipostp => {
                                                this.id_tipostp = responseTipostp.id;

                                                const recomendaciones: Recomendacion[] = [
                                                    { observacion: this.observacion6, aviso: this.aviso6 },
                                                    { observacion: this.observacion7, aviso: this.aviso7 },
                                                    { observacion: this.observacion8, aviso: this.aviso8 }
                                                    // ... más recomendaciones
                                                ];

                                                this.RecomendacionService.insertarRecomendacion(recomendaciones).subscribe(responseRecomendacion => {
                                                    this.recomendacion_lote_id = responseRecomendacion.lote_id;

                                                    const pat1spt1: Pat1spt1[] = [
                                                        {
                                                            Electrodo: this.options['selectedOption'].selected,
                                                            Soldadura: this.options['selectedOption1'].selected,
                                                            Conductor: this.options['selectedOption2'].selected,
                                                            Conector: this.options['selectedOption3'].selected,
                                                            Caja_de_Registro: this.options['selectedOption4'].selected,
                                                            Identificacion: this.options['selectedOption5'].selected
                                                        }
                                                    ];

                                                    this.Pat1spt1Service.insertarPat1Spt1(pat1spt1).subscribe(responsepat1spt1 => {

                                                        const pat2spt1: Pat2spt1[] = [
                                                            {
                                                                Electrodo: this.options['selectedOption6'].selected,
                                                                Soldadura: this.options['selectedOption7'].selected,
                                                                Conductor: this.options['selectedOption8'].selected,
                                                                Conector: this.options['selectedOption9'].selected,
                                                                Caja_de_Registro: this.options['selectedOption10'].selected,
                                                                Identificacion: this.options['selectedOption11'].selected
                                                            }
                                                        ];

                                                        this.Pat2spt2Service.insertarPat2Spt1(pat2spt1).subscribe(responsepat2spt1 => {

                                                            const pat3spt1: Pat3spt1[] = [
                                                                {
                                                                    Electrodo: this.options['selectedOption12'].selected,
                                                                    Soldadura: this.options['selectedOption13'].selected,
                                                                    Conductor: this.options['selectedOption14'].selected,
                                                                    Conector: this.options['selectedOption15'].selected,
                                                                    Caja_de_Registro: this.options['selectedOption16'].selected,
                                                                    Identificacion: this.options['selectedOption17'].selected
                                                                }
                                                            ];

                                                            this.Pat3spt1Service.insertarPat3Spt1(pat3spt1).subscribe(responsepat3spt1 => {

                                                                const pat4spt1: Pat4spt1[] = [
                                                                    {
                                                                        Electrodo: this.options['selectedOption18'].selected,
                                                                        Soldadura: this.options['selectedOption19'].selected,
                                                                        Conductor: this.options['selectedOption20'].selected,
                                                                        Conector: this.options['selectedOption21'].selected,
                                                                        Caja_de_Registro: this.options['selectedOption22'].selected,
                                                                        Identificacion: this.options['selectedOption23'].selected
                                                                    }
                                                                ];

                                                                this.Pat4spt1Service.insertarPat4Spt1(pat4spt1).subscribe(responsepat4spt1 => {

                                                                    const spt1Data: Spt1 = {
                                                                        tagSubestacion: this.tagSubestacion,
                                                                        ot: this.ot,
                                                                        ubicacion: this.ubicacion,
                                                                        fecha: this.fecha,
                                                                        lider: this.correoSeleccionado,
                                                                        supervisor: this.correoSeleccionado1,
                                                                        inicio: this.inicio,
                                                                        fin: this.fin,
                                                                        firma: false,
                                                                        Pat1Spt1Id: responsepat1spt1.pat1Spt1Id,
                                                                        Pat2Spt1Id: responsepat2spt1.pat2Spt1Id,
                                                                        Pat3Spt1Id: responsepat3spt1.pat3Spt1Id,
                                                                        Pat4Spt1Id: responsepat4spt1.pat4Spt1Id,
                                                                        lote_id: this.seguridad_observacion, // asegúrate de que seguridad_observacion tiene un valor válido
                                                                        barra_e_noAi_lote_id: this.barra_e_noAi,
                                                                        barra_e_Ai_lote_id: this.barra_e_Ai,
                                                                        cerco_p_noAi_lote_id: this.cerco_p_noAi,
                                                                        cerco_p_Ai_lote_id: this.cerco_p_Ai,
                                                                        transformador_noAi_lote_id: this.transformador_noAi,
                                                                        id_tipostp: this.id_tipostp,
                                                                        recomendacion_lote_id: this.recomendacion_lote_id
                                                                    };

                                                                    this.Spt1Service.insertarSpt1(spt1Data).subscribe(responsespt1 => {
                                                                        this.id_spt1 = responsespt1.id;
                                                                        console.log(this.patValues[0], 'Esto es para ver si sale algo');
                                                                        this.messageService.remove('evaluacion');
                                                                        this.notificationService.success(
                                                                            'Datos Guardados',
                                                                            'Los datos se han guardado correctamente.'
                                                                        );
                                                                    }, error => {
                                                                        this.messageService.remove('evaluacion');
                                                                        this.notificationService.error(
                                                                            'Error al Guardar',
                                                                            'Ha ocurrido un error al guardar los datos.'
                                                                        );
                                                                    });
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                } catch (error) {
                    this.messageService.remove('evaluacion');
                    this.notificationService.error(
                        'Error al Guardar',
                        'Ha ocurrido un error inesperado al guardar los datos.'
                    );
                }
            }
        });
    }
















































































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
