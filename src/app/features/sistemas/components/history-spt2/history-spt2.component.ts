import { AuthServiceService } from 'src/app/features/sistemas/services/auth-service.service';
import { UsuarioService } from 'src/app/features/sistemas/services/usuario.service';
import { MetodoSelectivoService } from './../../services/metodo-selectivo.service';
import { MetodoCaidaService } from './../../services/metodo-caida.service';
import { DashSpt2Service } from './../../services/dash-spt2.service';
import { Spt2Service } from './../../services/spt2.service';
import { PdfGeneratorServiceService } from '../../services/pdf-generator-service.service';
import { Component ,OnInit,ViewChild,TemplateRef} from '@angular/core';
import { MostrarSpt2 } from '../../interface/spt2';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzModalRef } from 'ng-zorro-antd/modal/modal-ref';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DomSanitizer, SafeHtml,SafeResourceUrl  } from '@angular/platform-browser';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AlertService } from '../../services/alert.service';
import 'datatables.net';
import 'datatables.net-buttons';
import 'datatables.net-buttons/js/buttons.html5.js';
import 'datatables.net-buttons/js/buttons.print.js';

import 'jszip';
import 'pdfmake';
import 'pdfmake/build/vfs_fonts.js';
import { SharedModule } from 'src/app/shared/shared.module';
import { Router, ActivatedRoute } from '@angular/router';

import * as XLSX from 'xlsx';
@Component({
  selector: 'app-history-spt2',
  standalone: true,
  imports: [SharedModule,NzModalModule],
  templateUrl: './history-spt2.component.html',
  styleUrl: './history-spt2.component.css'
})
export class HistorySpt2Component implements OnInit{
  spt2List: MostrarSpt2[] = [];
  filteredSpt2List: MostrarSpt2[] = [];

  mostrarHerramientas: boolean = false;
  modalRef: NzModalRef | null = null;
  loading = true;
  pageIndex: number = 1;
  pageSize: number = 7;

  @ViewChild('pdfModal', { static: true }) pdfModal!: TemplateRef<any>;
  pdfUrl: SafeResourceUrl | null = null;


  // Filtros para los campos sujeción
  filterohm_sujecion: string = '';
  filterohm_caida: string = '';
  filterohm_selectivo: string = '';


    // Filtros para cada columna
    filterSubestacion: string = '';
    filterOt: string = '';
    filterFecha: string = '';

    filterLider: string = '';
    filterSupervisor: string = '';


  constructor(private spt2Service: Spt2Service, private router: Router,
    private pdfGeneratorService:PdfGeneratorServiceService,
    private Spt2Service:Spt2Service,
    private DashSpt2Service:DashSpt2Service,
    private sanitizer: DomSanitizer,
    private modal: NzModalService,
    private MetodoCaidaService : MetodoCaidaService,
    private MetodoSelectivoService : MetodoSelectivoService,
    private usuarioService : UsuarioService,
    private AuthService : AuthServiceService,
    private messageService:NzMessageService,
    private alertservice: AlertService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    const storedCargo = localStorage.getItem('cargo');
    if (storedCargo) {
      this.mostrarHerramientas = storedCargo === 'SUPERVISOR';
    }

     // Obtener datos de SPT2 y procesarlos
     this.spt2Service.obtenerSpt2().subscribe(
      (data: MostrarSpt2[]) => {
        this.spt2List = data.map(item => {
          console.log("data spt2",data)
          const ohmSujecionArray = item.ohm_sujecion ? item.ohm_sujecion.split(',').map(val => val.trim()) : [];
          const ohmSelectivoArray = item.ohm_selectivo ? item.ohm_selectivo.split(',').map(val => val.trim()) : [];
          const ohmCaidaArray = item.ohm_caida ? item.ohm_caida.split(',').map(val => val.trim()) : [];

          return {
            ...item,
            pat1_sujecion: ohmSujecionArray[0] || null,
            pat2_sujecion: ohmSujecionArray[1] || null,
            pat3_sujecion: ohmSujecionArray[2] || null,
            pat4_sujecion: ohmSujecionArray[3] || null,
            pat1_selectivo: ohmSelectivoArray[0] || null,
            pat2_selectivo: ohmSelectivoArray[1] || null,
            pat3_selectivo: ohmSelectivoArray[2] || null,
            pat4_selectivo: ohmSelectivoArray[3] || null,
            pat1_caida: ohmCaidaArray[0] || null,
            pat2_caida: ohmCaidaArray[1] || null,
            pat3_caida: ohmCaidaArray[2] || null,
            pat4_caida: ohmCaidaArray[3] || null,
            tipo_metodo: 'SIN PICAS', // Valor inicial predeterminado

            // Inicializa los valores visibles de Pat1 a Pat4 para SIN PICAS
          pat1: ohmSujecionArray[0] || null,
          pat2: ohmSujecionArray[1] || null,
          pat3: ohmSujecionArray[2] || null,
          pat4: ohmSujecionArray[3] || null
          };
        });

        this.filteredSpt2List = this.spt2List;
        this.loading = false;
      },
      (error) => {
        console.error('Error al obtener la lista SPT2', error);
        this.loading = false;
      }
    );
  }

  onMetodoChange(item: any) {
    // Actualizar el valor de `selectedMethodLabel`


    // Actualiza los valores de Pat1, Pat2, Pat3, y Pat4 según el método seleccionado
    switch (item.tipo_metodo) {
      case 'SIN PICAS':
        item.pat1 = item.pat1_sujecion;
        item.pat2 = item.pat2_sujecion;
        item.pat3 = item.pat3_sujecion;
        item.pat4 = item.pat4_sujecion;
        break;
      case 'METODO SELECTIVO':
        item.pat1 = item.pat1_selectivo;
        item.pat2 = item.pat2_selectivo;
        item.pat3 = item.pat3_selectivo;
        item.pat4 = item.pat4_selectivo;
        break;
      case 'METODO CAIDA':
        item.pat1 = item.pat1_caida;
        item.pat2 = item.pat2_caida;
        item.pat3 = item.pat3_caida;
        item.pat4 = item.pat4_caida;
        break;
    }
  }

  applyFilter() {
    this.filteredSpt2List = this.spt2List.filter(item =>
      (!this.filterSubestacion || item.tag_subestacion?.toLowerCase().includes(this.filterSubestacion.toLowerCase())) &&
      (!this.filterOt || item.ot?.toLowerCase().includes(this.filterOt.toLowerCase())) &&
      (!this.filterFecha || item.fecha?.toLowerCase().includes(this.filterFecha.toLowerCase())) &&
      (!this.filterohm_sujecion || item.ohm_sujecion?.toString().includes(this.filterohm_sujecion)) &&
      (!this.filterohm_caida || item.ohm_caida?.toString().includes(this.filterohm_caida)) &&
      (!this.filterohm_selectivo || item.ohm_selectivo?.toString().includes(this.filterohm_selectivo)) &&
      (!this.filterLider || item.usuario_lider?.toLowerCase().includes(this.filterLider.toLowerCase())) &&
      (!this.filterSupervisor || item.usuario_supervisor?.toLowerCase().includes(this.filterSupervisor.toLowerCase()))
    );
  }
  verTendencia(item: any) {
    const tagSubestacion = item.tag_subestacion || '';
    console.log('Tag Subestación:', tagSubestacion);

    this.router.navigate(['/sistemas/grafico-spt2'], {
      queryParams: { tag_subestacion: tagSubestacion }
    });
  }


  /*verTendencia(){
    this.route.queryParams.subscribe(params => {
      const tagSubestacion = params['tag_subestacion'] || '';
      console.log('Tag Subestación:',spt2List.tag_subestacion);
      this.router.navigate(['/sistemas/grafico-spt2'], {
        queryParams: { tag_subestacion: tagSubestacion }
      });

      // O cualquier otra lógica que necesites hacer con el parámetro.
    });
  }*/

  /*onMetodoChange(item: Spt2) {
    console.log('Método seleccionado:', item.tipo_metodo);
    console.log('Subestación:', item.tag_subestacion, 'OT:', item.ot);

    // Si el tipo de método es "SIN PICAS"
    if (item.tipo_metodo === 'SIN PICAS') {
      console.log('Buscando datos para SIN PICAS');
      this.spt2Service.buscarPorSubestacionyot(item.tag_subestacion, item.ot).subscribe((data) => {
        console.log('Datos obtenidos para SIN PICAS:', data);
        if (data.length > 0) {
          // Convierte los valores a número antes de comparar
          item.pat1 = Number(data[0].pat1) !== 0 ? data[0].pat1 : '';
          item.pat2 = Number(data[0].pat2) !== 0 ? data[0].pat2 : '';
          item.pat3 = Number(data[0].pat3) !== 0 ? data[0].pat3 : '';
          item.pat4 = Number(data[0].pat4) !== 0 ? data[0].pat4 : '';
          console.log('Valores actualizados:', item.pat1, item.pat2, item.pat3, item.pat4);
        }
      });
    }

    // Si el tipo de método es "METODO SELECTIVO"
    else if (item.tipo_metodo === 'METODO SELECTIVO') {
      console.log('Buscando datos para METODO SELECTIVO');
      this.MetodoSelectivoService.getMetodoSelectivoById(item.id_mselectivo).subscribe((data) => {
        console.log('Datos obtenidos para METODO SELECTIVO:', data);
        if (data.length > 0) {
          // Convierte los valores a número antes de comparar
          item.pat1 = Number(data[0].valorms) !== 0 ? data[0].valorms : '';
          item.pat2 = Number(data[1].valorms) !== 0 ? data[1].valorms : '';
          item.pat3 = Number(data[2].valorms) !== 0 ? data[2].valorms : '';
          item.pat4 = Number(data[3].valorms) !== 0 ? data[3].valorms : '';
          console.log('Valores actualizados:', item.pat1, item.pat2, item.pat3, item.pat4);
        }
      });
    }

    // Si el tipo de método es "METODO CAIDA"
    else if (item.tipo_metodo === 'METODO CAIDA') {
      console.log('Buscando datos para METODO CAIDA');
      this.MetodoCaidaService.getMetodoCaidaById(item.id_mcaida).subscribe((data) => {
        console.log('Datos obtenidos para METODO CAIDA:', data);
        if (data.length > 0) {
          // Convierte los valores a número antes de comparar
          item.pat1 = Number(data[0].valormc) !== 0 ? data[0].valormc : '';
          item.pat2 = Number(data[1].valormc) !== 0 ? data[1].valormc : '';
          item.pat3 = Number(data[2].valormc) !== 0 ? data[2].valormc : '';
          item.pat4 = Number(data[3].valormc) !== 0 ? data[3].valormc : '';
          console.log('Valores actualizados:', item.pat1, item.pat2, item.pat3, item.pat4);
        }
      });
    } else {
      console.warn('Método no reconocido:', item.tipo_metodo);
    }
  }




  applyFilter() {
    this.filteredSpt2List = this.spt2List.filter(item =>
      (!this.filterSubestacion || item.tag_subestacion?.toLowerCase().includes(this.filterSubestacion.toLowerCase())) &&
      (!this.filterOt || item.ot?.toLowerCase().includes(this.filterOt.toLowerCase())) &&
      (!this.filterFecha || item.fecha?.toLowerCase().includes(this.filterFecha.toLowerCase())) &&
      (!this.filterTipoMetodo || (item.tipo_metodo && item.tipo_metodo.toLowerCase().includes(this.filterTipoMetodo.toLowerCase()))) &&
      (!this.filterPat1 || item.pat1?.toString().toLowerCase().includes(this.filterPat1.toLowerCase())) &&
      (!this.filterPat2 || item.pat2?.toString().toLowerCase().includes(this.filterPat2.toLowerCase())) &&
      (!this.filterPat3 || item.pat3?.toString().toLowerCase().includes(this.filterPat3.toLowerCase())) &&
      (!this.filterPat4 || item.pat4?.toString().toLowerCase().includes(this.filterPat4.toLowerCase())) &&
      (!this.filterLider || item.lider?.toLowerCase().includes(this.filterLider.toLowerCase())) &&
      (!this.filterSupervisor || item.supervisor?.toLowerCase().includes(this.filterSupervisor.toLowerCase()))
    );
  }

  /*verTendencia(spt2: any) {
    const { tag_subestacion, ot, fecha, lider, supervisor, pat01, pat02, pat03, pat04 } = spt2;

    console.log("Datos pasados al servicio verTendencia:", {
      tag_subestacion, ot, fecha, lider, supervisor, pat01, pat02, pat03, pat04
    });

    this.Spt2Service.buscarPorSubestacion(tag_subestacion).subscribe(
      (resultados) => {
        this.DashSpt2Service.actualizarResultadosBúsqueda(resultados);
        this.router.navigate(['sistemas/grafico-spt2']);
      },
      (error) => {
        console.error('Error al buscar por subestación con tag:', error);
        // Lógica para manejar errores
      }
    );
  }*/


  // Exportar a CSV
  /*exportToCSV() {
    const csvContent = this.filteredSpt2List.map(item => {
      return `${item.tag_subestacion},${item.ot},${item.fecha},${item.tipo_metodo},${item.pat1},${item.pat2},${item.pat3},${item.pat4},${item.lider},${item.supervisor}`;
    }).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'tabla.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Exportar a Excel
  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredSpt2List);
    const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    XLSX.writeFile(wb, 'tabla.xlsx');
}*/






verDocumentos(id_spt2: number): void {
  console.log('ID SPT2:', id_spt2);


  // Llamar al método generarPDF pasando solo el id_spt2
  this.pdfGeneratorService.generarPDF(id_spt2).then((pdfBlob: Blob) => {
    // Convertir el Blob a una URL segura
    const pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      URL.createObjectURL(pdfBlob) + '#toolbar=0'
    );

    // Asignar la URL a la variable correspondiente
    this.pdfUrl = pdfUrl;
    console.log('PDF URL:', pdfUrl);  // Debugging

    // Abrir el PDF en una nueva pestaña del navegador
    //window.open(URL.createObjectURL(pdfBlob), '_blank');
    console.log('PDF abierto con éxito');  // Debugging
  }).catch(error => {
    console.error('Error al abrir el PDF:', error);
  });
}


  /*eliminarRegistro(id_spt2: number): void {
    // Mostrar el modal de confirmación
    this.modal.confirm({
      nzTitle: 'Confirmación',
      nzContent: '¿Estás seguro de que quieres eliminar spt2?',
      nzOkText: 'Aceptar',
      nzCancelText: 'Cancelar',
      nzOnOk: async () => {
        // Mostrar mensaje de carga mientras se realiza la operación
        const loadingMessageId = this.messageService.loading('Evaluando los datos, por favor espera...', { nzDuration: 0 }).messageId;

        // Llamar al servicio para eliminar el registro
        this.spt2Service.eliminarSpt2(id_spt2).subscribe({
          next: () => {
            // Eliminar el mensaje de carga
            this.messageService.remove(loadingMessageId);

            // Mostrar mensaje de éxito
            this.alertservice.success('spt2 eliminar', 'Los datos se han eliminado con éxito.');

            // Aquí puedes realizar otras acciones, como actualizar la tabla
            this.actualizarTabla(id_spt2);
          },
          error: (err) => {
            // Eliminar el mensaje de carga
            this.messageService.remove(loadingMessageId);

            // Mostrar mensaje de error
            this.alertservice.error('Error', 'No se pudo eliminar el registro. Por favor, intenta de nuevo.');
          }
        });
      },
      nzOnCancel: () => {
        this.alertservice.warning('Cancelado', 'La eliminación ha sido cancelada.');
      }
    });
  }*/
  actualizarTabla(id_spt2: number): void {
    // Filtrar la lista eliminando el registro que tiene el idSpt2
    this.spt2List = this.spt2List.filter(item => item.id_spt2 !== id_spt2);

    // Actualizar la tabla de DataTables
    const table = $('#example').DataTable();
    table.clear();
    table.rows.add(this.spt2List); // Volver a agregar los datos actualizados
    table.draw();
  }





}
