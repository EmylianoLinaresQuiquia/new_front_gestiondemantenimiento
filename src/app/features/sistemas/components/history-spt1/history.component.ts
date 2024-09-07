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
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
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
  selectedPatData: string[] = []; // Datos seleccionados para el modal
  modalRef: NzModalRef | null = null;
  @ViewChild('patDetailsTemplate', { static: true }) patDetailsTemplate!: TemplateRef<any>;

  @ViewChild('pdfModal', { static: true }) pdfModal!: TemplateRef<any>;
  pdfUrl: SafeResourceUrl | null = null;
  chart!: am4charts.XYChart;
  constructor(private spt1Service: Spt1Service,
    private modal: NzModalService,
    private pdfGeneratorService: PdfGeneratorServicespt1Service,
    private sanitizer: DomSanitizer

  ) {}

  ngOnInit(): void {
    this.spt1Service.mostrarSpt1().subscribe((data: Spt1[]) => {
      this.spt1Data = data; // Asignar los datos directamente
      console.log('data', this.spt1Data);
      this.initDataTable();
    });

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

  initDataTable() {
    $(document).ready(() => {
      $('<style>')
        .prop('type', 'text/css')
        .html(`
          #example tbody tr:hover {
            background-color: #dfdfdf !important;
          }
        `)
        .appendTo('head');

      const table = $('#example').DataTable({
        dom: 'Brtipl',
        buttons: [
          {
            extend: 'excelHtml5',
            text: '<i class="fas fa-file-excel" style="color: green;"></i> Excel',
            className: 'btn btn-success'
          },
          {
            extend: 'pdfHtml5',
            text: '<i class="fas fa-file-pdf" style="color: red;"></i> PDF',
            className: 'btn btn-danger'
          },
          {
            extend: 'print',
            text: '<i class="fas fa-print" style="color: blue;"></i> Imprimir',
            className: 'btn btn-info'
          }
        ],
        data: this.spt1Data,
        columns: [
          { data: 'tagSubestacion', title: 'Tag Subestacion', width: '19%' },
          { data: 'ot', title: 'OT', width: '12%' },
          { data: 'fecha', title: 'Fecha', width: '14%' },
          {
            data: 'pat1', title: 'PAT1', width: '5%',
            render: (data, type, full, meta) => this.getPatIcon(full.pat1, 'PAT1', meta.row)
          },
          {
            data: 'pat2', title: 'PAT2', width: '5%',
            render: (data, type, full, meta) => this.getPatIcon(full.pat2, 'PAT2', meta.row)
          },
          {
            data: 'pat3', title: 'PAT3', width: '5%',
            render: (data, type, full, meta) => this.getPatIcon(full.pat3, 'PAT3', meta.row)
          },
          {
            data: 'pat4', title: 'PAT4', width: '5%',
            render: (data, type, full, meta) => this.getPatIcon(full.pat4, 'PAT4', meta.row)
          },
          { data: 'lider', title: 'Líder', width: '18%' },
          { data: 'supervisor', title: 'Supervisor', width: '18%' },
          {
            data: 'documento', title: 'Documento', width: '5%',
            render: (data, type, full, meta) => {
              return `<a class="pdf-icon" data-id="${full.idSpt1}">
                <i class="fas fa-file-pdf" style="color:orange;"></i>
              </a>`;
            }
          },
          {
            data: 'herramientas', title: 'Herramientas', width: '50%',
            render: (data, type, full, meta) => {
              return `<button class="btn btn-danger btn-sm delete-btn" data-row="${meta.row}">
                        <i class="fas fa-trash-alt"></i>
                      </button>`;
            }
          }
        ],
        initComplete: (settings: any, json: any) => {
          const api = new $.fn.dataTable.Api(settings);

          api.columns().every((columnIdx: any) => {
            const column = api.column(columnIdx);
            const header = $(column.header());

            // Excluir las columnas "Documento" y "Herramientas" del filtrado
            const title = $(header).text().trim();
            if (title !== 'Documento' && title !== 'Herramientas') {
              const input = $('<input type="text" />')
                .appendTo(header)
                .on('keyup change', function () {
                  if (column.search() !== (this as HTMLInputElement).value) {
                    column.search((this as HTMLInputElement).value).draw();
                  }
                });
            }
          });

          $('#example').on('click', '.pat-icon', (event) => {
            const patData = $(event.currentTarget).data('pat-data');
            const patNumber = $(event.currentTarget).data('pat-number');
            this.openPatDetails(patData, patNumber);
          });

          $('#example').on('click', '.delete-btn', (event) => {
            const rowIndex = $(event.currentTarget).data('row');
            this.deleteRow(rowIndex);
          });

          $('#example').on('click', '.pdf-icon', (event) => {
            const id_spt1 = $(event.currentTarget).data('id');
            this.openPdf(id_spt1);
          });
        }
      });
    });
  }


  openPdf(id_spt1: number): void {
    this.pdfGeneratorService.generarPDF(id_spt1).then((pdfBlob: Blob) => {
      const pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        URL.createObjectURL(pdfBlob) + '#toolbar=0'  // Oculta la barra de herramientas del visor PDF
      );

      this.pdfUrl = pdfUrl; // Asigna el pdfUrl a la propiedad de la clase

      this.modal.create({
        nzTitle: 'PDF Document',
        nzContent: this.pdfModal,
        nzFooter: null,
        nzWidth: 1200
      });
    }).catch(error => {
      console.error('Error opening PDF:', error);
    });
  }




  deleteRow(rowIndex: number) {
    const table = $('#example').DataTable();
    table.row(rowIndex).remove().draw();
  }

  getPatIcon(patData: any, patNumber: string, rowIndex: number): string {
    if (typeof patData !== 'string') {
      return '';
    }

    const estados = patData.split(',');
    const todosBuenos = estados.every(estado => estado.trim() === 'Buen Estado');
    const iconClass = todosBuenos ? 'fas fa-check-circle' : 'fas fa-times-circle';
    const color = todosBuenos ? 'green' : 'red';

    return `<i class="${iconClass} pat-icon" style="color: ${color};" data-pat-data="${patData}" data-pat-number="${patNumber}"></i>`;
  }

  openPatDetails(patData: string, patNumber: string): void {
    console.log('openPatDetails called', { patData, patNumber });

    // Define los pares clave-valor para los detalles del PAT
    const labels = [
        'Electrodo ',
        'Soldadura ',
        'Conductor ',
        'Conector ',
        'Identificación ',
        'Caja de registro '
    ];

    // Combina los labels con los datos de patData
    const dataArray = patData.split(',');
    this.selectedPatData = dataArray.map((data, index) => {
        return `${labels[index]}: ${data}`;
    });

    this.modalRef = this.modal.create({
      nzTitle: `Detalles de ${patNumber}`,
      nzContent: this.patDetailsTemplate, // Utiliza el template del modal
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

