import { Component,OnInit,ViewChild,TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Spt1Service } from '../../services/spt1.service';
import { Spt1 } from '../../interface/spt1';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzModalRef } from 'ng-zorro-antd/modal/modal-ref';
import { SharedModule } from 'src/app/shared/shared.module';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { DomSanitizer, SafeHtml,SafeResourceUrl  } from '@angular/platform-browser';
import { PdfGeneratorServicespt1Service } from '../../services/pdf-generator-servicespt1.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AlertService } from '../../services/alert.service';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { ChangeDetectorRef } from '@angular/core';
am4core.useTheme(am4themes_animated);
@Component({
  selector: 'app-history',
  standalone: true,
  imports: [NzModalModule,SharedModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit {
  spt1Data: Spt1[] = [];
  mostrarHerramientas: boolean = false;
  selectedPatData: string[] = []; // Datos seleccionados para el modal
  modalRef: NzModalRef | null = null;
  @ViewChild('patDetailsTemplate', { static: true }) patDetailsTemplate!: TemplateRef<any>;

  @ViewChild('pdfModal', { static: true }) pdfModal!: TemplateRef<any>;
  pdfUrl: SafeResourceUrl | null = null;
  chart!: am4charts.XYChart;

  filteredData: any[] = [];
  loading = true;
  pageIndex: number = 1;
  pageSize: number = 7;



  // Variables para los filtros
  filterTagSubestacion: string = '';
  filterOt: string = '';
  filterFecha: string = '';
  filterPat1: string = '';
  filterPat2: string = '';
  filterPat3: string = '';
  filterPat4: string = '';
  filterLider: string = '';
  filterSupervisor: string = '';
  constructor(private spt1Service: Spt1Service,
    private modal: NzModalService,
    private pdfGeneratorService: PdfGeneratorServicespt1Service,
    private sanitizer: DomSanitizer,
    private messageService:NzMessageService,
    private alertservice: AlertService,
    private cdr: ChangeDetectorRef

  ) {}

  ngOnInit(): void {
    // Recuperar el cargo del usuario desde localStorage
  const storedCargo = localStorage.getItem('cargo');
  if (storedCargo) {
    console.log(`Cargo almacenado en localStorage: ${storedCargo}`);
    this.mostrarHerramientas = storedCargo === 'SUPERVISOR';
    console.log(
      this.mostrarHerramientas
        ? 'El usuario es SUPERVISOR, se mostrará la columna Herramientas'
        : 'El usuario no es SUPERVISOR, no se mostrará la columna Herramientas'
    );
  } else {
    console.log('No se encontró un cargo almacenado en localStorage');
    this.mostrarHerramientas = false;
  }

  // Obtener los datos de SPT1
  this.spt1Service.mostrarSpt1().subscribe(
    (data: Spt1[]) => {
      this.spt1Data = data; // Asignar los datos directamente
      console.log('Datos de SPT1:', this.spt1Data);

      // Inicializar la tabla solo después de recibir los datos
      this.filteredData = this.spt1Data;
      this.loading = false;
    },
    (error) => {
      console.error('Error al obtener la lista SPT1', error);
      this.loading = false;
    }
  );

     // Ejecutar TotalSpt1Pat1 y crear gráfico
     this.spt1Service.ejecutarTotalSpt1Pat1().subscribe((data: any) => {
      const chartData = this.formatDataForChart(data);
      this.createChart(chartData, 'chartDiv1'); // Pasa un ID diferente si tienes múltiples gráficos
    });

    // Ejecutar TotalSpt1Pat2 y crear gráfico
    this.spt1Service.ejecutarTotalSpt1Pat2().subscribe((data: any) => {
      const chartData = this.formatDataForChart(data);
      this.createChart(chartData, 'chartDiv2'); // Pasa un ID diferente para el segundo gráfico
    });

    // Ejecutar TotalSpt1Pat3 y crear gráfico
    this.spt1Service.ejecutarTotalSpt1Pat3().subscribe((data: any) => {
      const chartData = this.formatDataForChart(data);
      this.createChart(chartData, 'chartDiv3'); // Pasa un ID diferente para el tercer gráfico
    });

    // Ejecutar TotalSpt1Pat4 y crear gráfico
    this.spt1Service.ejecutarTotalSpt1Pat4().subscribe((data: any) => {
      const chartData = this.formatDataForChart(data);
      this.createChart(chartData, 'chartDiv4'); // Pasa un ID diferente para el cuarto gráfico
    });

  }


  applyFilter(): void {
    this.filteredData = this.spt1Data.filter(item => {

      const matchTagSubestacion = this.filterTagSubestacion
      ? (item.tagSubestacion && item.tagSubestacion.toLowerCase().includes(this.filterTagSubestacion.toLowerCase())) // Verificar si item.tagSubestacion existe antes de usarlo
      : true;

      const matchOt = this.filterOt ? item.ot.toLowerCase().includes(this.filterOt.toLowerCase()) : true;
      // Convert 'fecha' to a string before comparison
      const matchFecha = this.filterFecha
      ? (item.fecha && new Date(item.fecha).toISOString().slice(0, 10) === this.filterFecha)
      : true;

      const matchPat1 = this.filterPat1 ? item.pat1.toLowerCase().includes(this.filterPat1.toLowerCase()) : true;
      const matchPat2 = this.filterPat2 ? item.pat2.toLowerCase().includes(this.filterPat2.toLowerCase()) : true;
      const matchPat3 = this.filterPat3 ? item.pat3.toLowerCase().includes(this.filterPat3.toLowerCase()) : true;
      const matchPat4 = this.filterPat4 ? item.pat4.toLowerCase().includes(this.filterPat4.toLowerCase()) : true;
      const matchLider = this.filterLider ? item.lider.toLowerCase().includes(this.filterLider.toLowerCase()) : true;
      const matchSupervisor = this.filterSupervisor ? item.supervisor.toLowerCase().includes(this.filterSupervisor.toLowerCase()) : true;

      return matchTagSubestacion && matchOt && matchFecha && matchPat1 && matchPat2 && matchPat3 && matchPat4 && matchLider && matchSupervisor;
    });
  }
  onPageIndexChange(newPageIndex: number): void {
    this.pageIndex = newPageIndex;
  }


  eliminarRegistro(id_spt1: number): void {
    this.modal.confirm({
      nzTitle: 'Confirmación',
      nzContent: '¿Estás seguro de que quieres eliminar el registro?',
      nzOkText: 'Aceptar',
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        const loadingMessageId = this.messageService.loading('Eliminando...', { nzDuration: 0 }).messageId;
        this.spt1Service.eliminarSpt1(id_spt1).subscribe({
          next: () => {
            this.messageService.remove(loadingMessageId);
            this.messageService.success('Registro eliminado correctamente');

            // Volver a cargar los datos desde el servidor
            this.spt1Service.mostrarSpt1().subscribe((data: Spt1[]) => {
              this.spt1Data = data;
              this.filteredData = this.spt1Data;
              this.cdr.detectChanges(); // Forzar detección de cambios si es necesario
            });

          },
          error: (err) => {
            this.messageService.remove(loadingMessageId);
            this.messageService.error('Error al eliminar el registro');
            console.error(err);
          }
        });
      }
    });
  }

  openPdf(id_spt1: number): void {
    this.pdfGeneratorService.generarPDF(id_spt1).then((pdfBlob: Blob) => {
        // Crear URL para el PDF
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Abrir el PDF en una nueva pestaña
       // window.open(pdfUrl, '_blank');
    }).catch(error => {
        console.error('Error opening PDF:', error);
    });
}

  // Método para descargar el PDF
  downloadPdf(pdfBlob: Blob): void {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(pdfBlob);
    link.download = 'spt1.pdf';
    link.click();
  }



  getPatIconClass(patData: string): string {
    if (typeof patData !== 'string') {
      return '';
    }

    const estados = patData.split(',');
    const todosBuenos = estados.every(estado => estado.trim() === 'Buen Estado');
    return todosBuenos ? 'fas fa-check-circle' : 'fas fa-times-circle';
  }

  getPatIconColor(patData: string): string {
    if (typeof patData !== 'string') {
      return '';
    }

    const estados = patData.split(',');
    const todosBuenos = estados.every(estado => estado.trim() === 'Buen Estado');
    return todosBuenos ? 'green' : 'red';
  }

  openPatDetails(patData: string, patNumber: string): void {
    console.log('openPatDetails called', { patData, patNumber });

    const labels = [
      'Electrodo ',
      'Soldadura ',
      'Conductor ',
      'Conector ',
      'Identificación ',
      'Caja de registro '
    ];

    const dataArray = patData.split(',');
    this.selectedPatData = dataArray.map((data, index) => `${labels[index]}: ${data}`);

    this.modalRef = this.modal.create({
      nzTitle: `Detalles de ${patNumber}`,
      nzContent: this.patDetailsTemplate,
      nzFooter: null
    });
  }




  formatDataForChart(data: any[]): { category: string, value: number, labelText: string }[] {
    const formattedData: { category: string, value: number, labelText: string }[] = [];

    // Recorrer cada clave en el primer objeto de la respuesta
    for (const key in data[0]) {
      if (data[0].hasOwnProperty(key)) {
        // Extraer el nombre del pozo (por ejemplo, "pozo 1") y el valor numérico
        const labelText = this.extractPozoName(data[0][key]); // Extraer nombre del pozo
        const value = this.extractNumber(data[0][key]); // Extraer número de veces

        formattedData.push({
          category: key,  // Usar la clave original como categoría (por ejemplo, "electrodo")
          value: value,
          labelText: labelText // Usar el nombre del pozo como etiqueta dentro de la barra
        });
      }
    }

    return formattedData;
}


  // Método para extraer el nombre del pozo (por ejemplo, "pozo 1" de "pozo 1 (10 veces)")
  extractPozoName(text: string): string {
    const match = text.match(/^(.*)\s\(\d+\sveces\)$/);
    return match ? match[1] : text;
  }

  extractNumber(text: string): number {
    const match = text.match(/\((\d+)\sveces\)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  createChart(chartData: { category: string; value: number; labelText: string }[], chartDivId: string) {
    let chart = am4core.create(chartDivId, am4charts.XYChart);
    chart.data = chartData;

    // Configurar ejes
    let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'category';
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.location = 0;

    // Reducir el minGridDistance para asegurar que las etiquetas estén más juntas
    categoryAxis.renderer.minGridDistance = 10; // Ajusta este valor según sea necesario

    // Agregar un poco de padding al lado izquierdo del eje Y
    categoryAxis.renderer.labels.template.padding(0, 10, 0, 0); // (top, right, bottom, left)

    let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;

    // Crear serie
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = 'value';
    series.dataFields.categoryY = 'category';
    series.columns.template.tooltipText = "{category}: [bold]{valueX}[/]";
    series.columns.template.fillOpacity = 0.8;
    series.columns.template.strokeWidth = 0;

    // Etiqueta dentro de la barra
    let labelInside = series.bullets.push(new am4charts.LabelBullet());
    labelInside.label.text = '{labelText}';
    labelInside.label.fill = am4core.color('#ffff'); // Cambia '#000' por '#ff0000' para asegurarte de que el color cambie
    labelInside.label.horizontalCenter = 'middle';
    labelInside.label.verticalCenter = 'middle';
    labelInside.label.width = am4core.percent(100);

    labelInside.label.fontSize = 10; // Ajusta el tamaño de la fuente si es necesario
    labelInside.label.maxWidth = 50; // Limitar la anchura máxima del texto

    // Etiqueta al final de la barra
    let endLabel = series.bullets.push(new am4charts.LabelBullet());
    endLabel.label.text = '{value}';
    endLabel.label.fill = am4core.color('#000');
    endLabel.label.horizontalCenter = 'right';
    endLabel.label.dx = 20;

    // Quitar leyenda si existe
    if (chart.legend) {
        chart.legend.dispose();
    }

    this.chart = chart;
}










  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.dispose();
    }
  }
}

