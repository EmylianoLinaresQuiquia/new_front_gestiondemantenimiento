import { Component, OnDestroy,ViewChild, OnChanges, SimpleChanges ,ViewContainerRef } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../interface/usuario';
import { UsuarioService } from '../../services/usuario.service';

import { SubestacionService } from '../../services/subestacion.service';
import { Subestacion } from '../../interface/subestacion';
import { InsertSpt2 } from '../../interface/spt2';
import { Spt2Service } from '../../services/spt2.service';

import { MetodoCaidaService } from '../../services/metodo-caida.service';

import { MetodoSelectivoService } from '../../services/metodo-selectivo.service';
import { ReportefotograficoService } from '../../services/reportefotografico.service';
import { MetodoCaidaGraficaService } from '../../services/metodo-caida-grafica.service';
import { MetodoSelectivoGraficaService } from '../../services/metodo-selectivo-grafica.service';
import { Notificacion } from '../../interface/notificacion';
import { NotificacionService } from '../../services/notificacion.service';
import { AuthServiceService } from '../../services/auth-service.service';
//import { PdfGeneratorPlanoService } from '../../services/pdf-generator-plano.service';
import { MetodoMedicion } from '../../interface/metodo-medicion';
import { MetodoMedicionService } from '../../services/metodo-medicion.service';


import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ChangeDetectorRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

//import { PdfViewerDialogComponent } from '../../transformadores/pm1/pdf-viewer-dialog/pdf-viewer-dialog.component';
//import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
//import { AlertService } from 'src/app/demo/service/alert.service';
//import * as echarts from 'echarts';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as echarts from 'echarts';
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4plugins_forceDirected from "@amcharts/amcharts4/plugins/forceDirected";
import  html2canvas from 'html2canvas';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../../services/alert.service';
import { PdfViewerComponent } from 'src/app/shared/components/pdf-viewer/pdf-viewer.component';
import { MedicionTelurometro } from '../../interface/medicion-telurometro';
import { MedicionTelurometroService } from '../../services/medicion-telurometro.service';
declare var $: any;


interface MetodoCaida {
  pat1: string;
  pat2: string;
  pat3: string;
  pat4: string;
  ohm: string;
  resultado: string;
}

interface MetodoSelectivo {
  pat1: string;
  pat2: string;
  pat3: string;
  pat4: string;
  ohm: string;
  resultado: string;
}
@Component({
  selector: 'app-spt2-inspection',
  standalone: true,
  imports: [SharedModule,NgxDropzoneModule],
  providers: [
    NzModalService, // Ensure the service is provided here
  ],
  templateUrl: './spt2-inspection.component.html',
  styleUrl: './spt2-inspection.component.css'
})
export class Spt2InspectionComponent implements OnDestroy {
  private chart: am4charts.XYChart | null = null;
  private selectivochart: am4charts.XYChart | null = null;
  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef | null = null;

    userEmail?: string;
  idSelectivo: number = 0;
  idCaida: number = 0;
  idReporteFoto: number=0;
  id_spt2:number = 0
  images: File[] = [];
  subestacion: Subestacion | null = null;
  tagSubestacion = '';
  ot = '';
  fecha ='';
  ubicacion = '';
  plano = '';
  fecha_plano = '';
  versio : number | null = null;
  id_subestacion : number | null = null;

  frecuencia: string = "111,128 Hz";
  fecha_calibracion: string = "09-07-2024";
  precision: string = "+/- 5%";
  n_serie: string = "ST181415734 B4";
  marca: string = "Fluke";
  modelo: string = "1625-2";

  cantidad_spt : number | null = null;
  r1 : number | null = null;
  r2  : number | null = null;
  r3 : number | null = null;
  conclucioncaida = '';
  r4 : number | null = null;
  r5 : number | null = null;
  r6 : number | null = null;
  idSupervisor = 0
  idLider = 0

  conclucionselectivo = '';
  conclusionespat='';
  usuarios: Usuario[] = [];
  correoSeleccionado = '';
  fotocheckSeleccionado : number | null = null;
  rutaFirmaSeleccionada = '';
  correoSeleccionado1 = '';
  fotocheckSeleccionado1 : number | null = null;
  idUsuarioSeleccionado:number | null = null;
  inputValues: number[] = [];
  selectivoValues: number[] = [];
  caidaValues:number[]=[]
  otraVariable: number[] = [];
  files: File[] = [];
  checkcaida : boolean =false
  checkpotencial : boolean =false
  checksinpicas : boolean =false

  prevCaidaValues: number[] = []
  prevSelectivoValues: number[] = [];

  esquema_caida: File | null = null;
esquema_selectivo: File | null = null;

  //items: MenuItem[] | undefined;
  constructor(private subestacionService: SubestacionService,
    private usuarioService: UsuarioService,
    private metodoSelectivoService :MetodoSelectivoService,
    private metodoCaidaService:MetodoCaidaService,
    private ReportefotograficoService:ReportefotograficoService,
    private spt2Service : Spt2Service,
    private MetodoCaidaGraficaService:MetodoCaidaGraficaService,
    private MetodoSelectivoGraficaService:MetodoSelectivoGraficaService,
    //private confirmationService: ConfirmationService,
    //private messageService: MessageService,
    private notificacionService: NotificacionService,
    //private PdfGeneratorPlanoService:PdfGeneratorPlanoService,
    private authService: AuthServiceService,
    private MetodoMedicionService:MetodoMedicionService,
    private http: HttpClient,
    //public dialog: MatDialog,
    //private alertservice: AlertService,
    private route: ActivatedRoute,
    private messageService:NzMessageService,
      private notificationService:NzNotificationService,
      private modal: NzModalService,
      private alertservice: AlertService,
      private MedicionTelurometroService:MedicionTelurometroService
) {

    }



  ngOnInit(): void {

    /*this.items = [
        {
            icon: 'pi pi-upload',
            command: () => {
                this.guardarDatos()
            }
        }

    ];*/

    this.route.queryParams.subscribe(params => {
      this.tagSubestacion = params['tag'] || '';
      this.ubicacion = params['ubicacion'] || '';
      this.plano = params['plano'] || '';
      this.cantidad_spt = params['cantidad_spt'] ? +params['cantidad_spt'] : null;
      this.fecha_plano = params['fecha_plano'] || '';
      this.versio = params['versio'] ? +params['versio'] : null;
      this.id_subestacion = params['id_subestacion'] ? +params['id_subestacion'] : null;
    });
    /*this.subestacionService.getSubestacionData().subscribe((data) => {
        console.log("data spt2",data)
      if (data) {
        this.tagSubestacion = data.tag_subestacion;
        this.ubicacion = data.ubicacion;
        this.plano = data.plano;
        this.fecha_plano = data.fecha_plano;
        this.versio = data.versio;
        this.cantidad_spt = data.cantidad_spt
        this.files = [];
      }

    });*/
    this.usuarioService.getUsers().subscribe(
      (usuarios: Usuario[]) => {
        this.usuarios = usuarios;
        if (this.usuarios.length > 0) {
        } else {
        }
      },
      (error: any) => {
      }
    )

    this.authService.userEmail$.subscribe(email => {
        this.userEmail = email;
     });


  }


  caidagrafico(): void {
    if (JSON.stringify(this.prevCaidaValues) === JSON.stringify(this.caidaValues)) {
      return;
    }

    this.prevCaidaValues = [...this.caidaValues];

    const chartContainer = document.getElementById('caida-chart');
    if (!chartContainer) {
      console.error('Chart container "caida-chart" not found in DOM.');
      return;
    }

    if (this.chart) {
      console.log('Disposing of existing chart');
      this.chart.dispose();
      this.chart = null;
    }

    am4core.useTheme(am4themes_animated);

    console.log('Creating chart instance');
    this.chart = am4core.create('caida-chart', am4charts.XYChart);

    // Desactivar el logo inmediatamente después de crear la instancia del gráfico
    if (this.chart && this.chart.logo) {
      this.chart.logo.disabled = true;
    }

    if (!this.chart) {
      console.error('Failed to create chart instance.');
      return;
    }

    const valuesPerCategory = 3; // Número de valores por cada PAT
    const categories: string[] = [];

    const cantidad_spt = this.cantidad_spt ?? 0;
    for (let i = 1; i <= cantidad_spt; i++) {
      categories.push(`PAT${i}`);
    }

    const chartData: Array<Record<string, any>> = [];
    for (let i = 0; i < valuesPerCategory; i++) {
      const dataPoint: Record<string, any> = { category: `Value ${i + 1}` };
      categories.forEach((category, index) => {
        dataPoint[category] = this.caidaValues[index * valuesPerCategory + i];
      });
      chartData.push(dataPoint);
    }

    console.log('Chart data:', chartData);
    this.chart.data = chartData;

    const categoryAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'category';
    categoryAxis.renderer.labels.template.disabled = true;

    const valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;

    const range = valueAxis.axisRanges.create();
    range.value = 25;
    range.grid.stroke = am4core.color('red');
    range.grid.strokeWidth = 2;
    range.grid.strokeOpacity = 1;

    const patColors: { [key: string]: string } = {
      'PAT1': 'rgb(201, 201, 52)',   // Color personalizado para PAT1
      'PAT2': 'rgb(0, 0, 49)',      // Color personalizado para PAT2
      'PAT3': 'rgb(69, 167, 167)',  // Color personalizado para PAT3
      'PAT4': 'rgb(189, 118, 31)'   // Color personalizado para PAT4
    };

    categories.forEach((category) => {
      const series = this.chart!.series.push(new am4charts.LineSeries());
      series.name = category;
      series.dataFields.valueY = category;
      series.dataFields.categoryX = 'category';
      series.strokeWidth = 3;
      series.tooltipText = `{name}: {valueY}`;

      const lineColor = am4core.color(patColors[category]);
      series.stroke = lineColor;

      const bullet = series.bullets.push(new am4charts.CircleBullet());
      bullet.circle.fill = lineColor; // Color de relleno del punto
      bullet.circle.stroke = am4core.color('#fff'); // Color del borde del punto
      bullet.circle.strokeWidth = 2;

      const labelBullet = series.bullets.push(new am4charts.LabelBullet());
      labelBullet.label.text = '{valueY}';
      labelBullet.label.dy = -10;
      labelBullet.label.fontSize = 12;
    });

    const legend = this.chart.legend = new am4charts.Legend();
    legend.itemContainers.template.events.on("over", (event) => {
      if (event.target.dataItem) {
        const series = event.target.dataItem.dataContext as am4charts.LineSeries;
        series.strokeWidth = 4;
      }
    });

    legend.itemContainers.template.events.on("out", (event) => {
      if (event.target.dataItem) {
        const series = event.target.dataItem.dataContext as am4charts.LineSeries;
        series.strokeWidth = 3;
      }
    });

    // Personalizar los marcadores de la leyenda directamente
    legend.markers.template.width = 15;
    legend.markers.template.height = 15;
   // Personalizar los marcadores de la leyenda directamente
if (legend.markers.template.children) {
  const markerChild = legend.markers.template.children.getIndex(0);
  if (markerChild) {
    markerChild.adapter.add('fill', (fill, target) => {
      const series = target.dataItem?.dataContext as am4charts.LineSeries;
      return series ? am4core.color(patColors[series.name]) : fill;
    });
  }
}


    this.chart.cursor = new am4charts.XYCursor();
    console.log('Chart created successfully');
  }





getRangeCaida(): number[] {
  const cantidad = this.cantidad_spt ?? 0; // Usar 0 si this.cantidad_spt es null o undefined
  return Array.from({ length: cantidad }, (_, index) => index);
}


getCaidaValue(index: number, subIndex: number): any {
  const value = this.caidaValues[index * 3 + subIndex];
  return value !== undefined && value !== null ? value : '';
}

updateCaidaValue(index: number, subIndex: number, value: number): void {
  this.caidaValues[index * 3 + subIndex] = value;
}


getResultadoCaida(index: number): { mensaje: string, color: string } {
const startIndex = index * 3;
const valores = [
  this.caidaValues[startIndex],
  this.caidaValues[startIndex + 1],
  this.caidaValues[startIndex + 2]
];

const valoresFiltrados = valores.filter(valor => valor !== null && valor !== undefined);
const promedio = valoresFiltrados.length > 0 ? Math.floor(valoresFiltrados.reduce((acc, valor) => acc + valor, 0) / valoresFiltrados.length) : 0;
return {
  mensaje: promedio > 25 ? 'NO CUMPLE' : (promedio <= 25 && valoresFiltrados.length > 0 ? 'CUMPLE' : ''),
  color: promedio > 25 ? 'red' : (promedio <= 25 && valoresFiltrados.length > 0 ? 'green' : '')
};

}


calcularPromedioCaida(index: number): number {
const startIndex = index * 3;
const valores = [
  this.caidaValues[startIndex],
  this.caidaValues[startIndex + 1],
  this.caidaValues[startIndex + 2]
];
const valoresFiltrados = valores.filter(valor => valor !== null && valor !== undefined);

// Calcula el promedio solo si hay valores
if (valoresFiltrados.length > 0) {
  const total = valoresFiltrados.reduce((acc, valor) => acc + valor, 0);
  const promedio = Math.floor(total / valoresFiltrados.length);
  //const otroIndice = 123;
  //const promedio1 = this.calcularPromedioCaida(otroIndice); // Reemplaza "otroIndice" con el índice adecuado
  this.caidagrafico();
  //this.mostrarpromedioselectivo();
     return promedio;
} else {
  return 0; // Retorna 0 si no hay valores para evitar divisiones por cero
}

}



selectivografico(): void {
  // Verificar si los valores han cambiado antes de actualizar el gráfico
  if (JSON.stringify(this.prevSelectivoValues) === JSON.stringify(this.selectivoValues)) {
    return;
  }

  // Actualizar valores previos
  this.prevSelectivoValues = [...this.selectivoValues];

  const chartContainer = document.getElementById('selectivo-chart');
  if (!chartContainer) {
    console.error('Chart container "selectivo-chart" not found in DOM.');
    return;
  }

  // Eliminar el gráfico existente antes de crear uno nuevo
  if (this.selectivochart) {
    console.log('Disposing of existing chart');
    this.selectivochart.dispose();
    this.selectivochart = null;
  }

  // Crear un nuevo gráfico
  am4core.useTheme(am4themes_animated);
  console.log('Creating chart instance');
  this.selectivochart = am4core.create('selectivo-chart', am4charts.XYChart);

  // Desactivar el logo inmediatamente después de crear la instancia del gráfico
  if (this.selectivochart && this.selectivochart.logo) {
    this.selectivochart.logo.disabled = true;
  }

  const valuesPerCategory = 3; // Número de valores por cada PAT
  const categories: string[] = [];

  const cantidad_spt = this.cantidad_spt ?? 0;
  // Generar dinámicamente las categorías en función de this.cantidad_spt
  for (let i = 1; i <= cantidad_spt; i++) {
    categories.push(`PAT${i}`);
  }

  const chartData: Array<Record<string, any>> = [];

  // Reestructurar chartData para que cada entrada represente una categoría PAT
  for (let i = 0; i < valuesPerCategory; i++) {
    const dataPoint: Record<string, any> = { category: `Value ${i + 1}` };
    categories.forEach((category, index) => {
      dataPoint[category] = this.selectivoValues[index * valuesPerCategory + i];
    });
    chartData.push(dataPoint);
  }

  console.log('Chart data:', chartData);
  this.selectivochart.data = chartData;

  // Configurar ejes y series
  const categoryAxis = this.selectivochart.xAxes.push(new am4charts.CategoryAxis());
  categoryAxis.dataFields.category = 'category'; // Categorías del eje X ahora son 'Value 1', 'Value 2', etc.
  categoryAxis.renderer.labels.template.disabled = true; // Deshabilitar etiquetas del eje X

  const valueAxis = this.selectivochart.yAxes.push(new am4charts.ValueAxis());
  valueAxis.min = 0;

  // Añadir una línea horizontal en el valor Y=25
  const range = valueAxis.axisRanges.create();
  range.value = 25;
  range.grid.stroke = am4core.color('red');
  range.grid.strokeWidth = 2;
  range.grid.strokeOpacity = 1;

  const patColors: { [key: string]: string } = {
    'PAT1': 'rgb(201, 201, 52)',   // Color personalizado para PAT1
    'PAT2': 'rgb(0, 0, 49)',      // Color personalizado para PAT2
    'PAT3': 'rgb(69, 167, 167)',  // Color personalizado para PAT3
    'PAT4': 'rgb(189, 118, 31)'   // Color personalizado para PAT4
  };

  // Crear series dinámicamente para cada categoría (PAT)
  if (this.selectivochart) {
    categories.forEach((category) => {
      const series = this.selectivochart!.series.push(new am4charts.LineSeries());
      series.name = category;
      series.dataFields.valueY = category;
      series.dataFields.categoryX = 'category';
      series.strokeWidth = 3;
      series.tooltipText = `{name}: {valueY}`;

      // Usar color correspondiente a la categoría PAT
      series.stroke = am4core.color(patColors[category]);

      const bullet = series.bullets.push(new am4charts.CircleBullet());
      bullet.circle.stroke = am4core.color('#fff');
      bullet.circle.strokeWidth = 2;

      // Aplicar color personalizado al relleno del punto
      bullet.circle.fill = am4core.color(patColors[category]);

      const labelBullet = series.bullets.push(new am4charts.LabelBullet());
      labelBullet.label.text = '{valueY}';
      labelBullet.label.dy = -10;
      labelBullet.label.fontSize = 11;
    });
  }

  // Agregar leyenda al gráfico
  this.selectivochart.legend = new am4charts.Legend();

  // Personalizar los marcadores de la leyenda
  const legend = this.selectivochart.legend;
  if (legend.markers.template.children) {
    const markerChild = legend.markers.template.children.getIndex(0);
    if (markerChild) {
      markerChild.adapter.add('fill', (fill, target) => {
        const series = target.dataItem?.dataContext as am4charts.LineSeries;
        return series ? am4core.color(patColors[series.name]) : fill;
      });
    }
  }

  this.selectivochart.cursor = new am4charts.XYCursor();

  console.log('Chart created successfully');
}

ngOnDestroy(): void {
  if (this.chart) {
    console.log('Disposing chart on component destroy');
    this.chart.dispose();
    this.chart = null; // Asegúrate de limpiar la referencia
  }
}


  capturarImagen(chartId: string, fileName: string): void {
    this.captureChartAsImage(chartId, fileName, (blob: Blob) => {
      // Aquí puedes realizar acciones con el blob si es necesario
    });

  }

  enviarImagencaida(): Promise<File> {
  return new Promise<File>((resolve, reject) => {
    const chartId = 'caida-chart';
    const fileName = 'caida-chart.png';

    this.captureChartAsImage(chartId, fileName, (blob: Blob) => {
      const file = new File([blob], fileName, { type: 'image/png' });
      this.esquema_caida = file;  // Asigna el archivo a esquema_caida
      resolve(file);  // Devuelve el archivo
    });
  });
}

enviarImagenselectivo(): Promise<File> {
  return new Promise<File>((resolve, reject) => {
    const chartId = 'selectivo-chart';
    const fileName = 'selectivo-chart.png';

    this.captureChartAsImage(chartId, fileName, (blob: Blob) => {
      const file = new File([blob], fileName, { type: 'image/png' });
      this.esquema_selectivo = file;  // Asigna el archivo a esquema_selectivo
      resolve(file);  // Devuelve el archivo
    });
  });
}




captureChartAsImage(chartId: string, fileName: string, callback: (blob: Blob) => void): void {
  const chartElement = document.getElementById(chartId);

  if (chartElement) {
    html2canvas(chartElement).then((canvas: HTMLCanvasElement) => {
      canvas.toBlob((blob) => {
        if (blob) {
          // Ejecuta el callback con el blob de la imagen
          callback(blob);
        }
      }, 'image/png');
    });
  } else {
    console.error(`No se pudo encontrar el elemento con el ID ${chartId}`);
  }
}




        onSelect(event: NgxDropzoneChangeEvent) {
          if (this.cantidad_spt !== null && this.files.length < this.cantidad_spt) {
            // Agregar las imágenes al arreglo
            this.files.push(...event.addedFiles);
          } else {
            // Manejar el caso donde cantidad_spt es null o ya se han agregado suficientes archivos
          }
        }

    onRemove(event: { file: File }): void {
      console.log(event);
      const fileToRemove = event.file;
      this.files.splice(this.files.indexOf(fileToRemove), 1);
    }

    getRangeSelectivo(): number[] {
      const cantidad = this.cantidad_spt ?? 0; // Usar 0 si this.cantidad_spt es null o undefined
      return Array.from({ length: cantidad }, (_, index) => index);
    }


      getSelectivoValue(index: number, subIndex: number): any {
        const value = this.selectivoValues[index * 3 + subIndex];
        return value !== undefined && value !== null ? value : '';
      }

      updateSelectivoValue(index: number, subIndex: number, value: number): void {
        this.selectivoValues[index * 3 + subIndex] = value;
      }

      getResultadoSelectivo(index: number): { mensaje: string, color: string } {
        const startIndex = index * 3;
        const valores = [
          this.selectivoValues[startIndex],
          this.selectivoValues[startIndex + 1],
          this.selectivoValues[startIndex + 2]
        ];

        const valoresFiltrados = valores.filter(valor => valor !== null && valor !== undefined);
        const promedio = valoresFiltrados.length > 0 ? Math.floor(valoresFiltrados.reduce((acc, valor) => acc + valor, 0) / valoresFiltrados.length) : 0;

        return {
          mensaje: promedio > 25 ? 'NO CUMPLE' : (promedio <= 25 && valoresFiltrados.length > 0 ? 'CUMPLE' : ''),
          color: promedio > 25 ? 'red' : (promedio <= 25 && valoresFiltrados.length > 0 ? 'green' : '')
        };
      }


      calcularPromedioSelectivo(index: number): number {
        const startIndex = index * 3;
        const valores = [
          this.selectivoValues[startIndex],
          this.selectivoValues[startIndex + 1],
          this.selectivoValues[startIndex + 2]
        ];

        // Convierte los valores a números y filtra los no válidos
        const valoresNumericos = valores.map(valor => Number(valor)).filter(valor => !isNaN(valor));

        // Calcula el promedio solo si hay valores numéricos válidos
        if (valoresNumericos.length > 0) {
          const total = valoresNumericos.reduce((acc, valor) => acc + valor, 0);
          const promedio = Math.floor(total / valoresNumericos.length);
          this.selectivografico();
          return promedio;
        } else {
          return 0; // Retorna 0 si no hay valores para evitar divisiones por cero
        }
      }

      getRange(): number[] {
        const cantidad = this.cantidad_spt ?? 0;
        return Array.from({ length: cantidad }, (_, index) => index);
      }

  getInputValue(index: number): any {
    return this.inputValues[index] !== undefined && this.inputValues[index] !== null ? this.inputValues[index] : '';
  }

  updateInputValue(index: number, event: any): void {
    const value = event.target.value;
    this.inputValues[index] = value;
  }
  getOtraVariableRange(): number[] {
    const cantidad = this.cantidad_spt ?? 0; // Usar 0 si this.cantidad_spt es null o undefined
    return Array.from({ length: cantidad }, (_, index) => index);
  }
  getOtraVariableInputValue(index: number): any {
    const value = this.otraVariable[index];
    return value !== undefined && value !== null ? value : '';
  }

  updateOtraVariableInputValue(index: number, event: any): void {
    const value = event.target.value;
    this.otraVariable[index] = value;
  }

  calcularPromedio(): number {
    const total = (this.r1 ?? 0) + (this.r2 ?? 0) + (this.r3 ?? 0);
    return Math.floor(total / 3);
  }
  mostrarMensaje(): boolean {
    // Calcula el promedio primero
    const promedio = this.calcularPromedio();
    return this.r1 !== 0 || this.r2 !== 0 || this.r3 !== 0;
  }

  calcularPromedio1(): number {
    const total = (this.r4 ?? 0) + (this.r5 ?? 0) + (this.r6 ?? 0);
    return Math.floor(total / 3);
  }

  mostrarMensaje1(): boolean {
    // Verifica si todos los valores son 0
    return this.r4 !== 0 || this.r5 !== 0 || this.r6 !== 0;
  }

  getResultadoInput(index: number): { mensaje: string, color: string } {
    const inputValue = this.inputValues[index] || 0;

    if (inputValue === 0) {
      // Si el valor es 0, no mostrar ningún mensaje ni color
      return { mensaje: '', color: '' };
    } else {
      // Verifica si el valor es menor o igual a 25
      const mensaje = inputValue <= 25 ? 'CUMPLE' : 'NO CUMPLE';
      const color = inputValue <= 25 ? 'green' : 'red';

      return { mensaje, color };
    }
  }

  seleccionarUsuario(event: any) {
    const fotocheckSeleccionado = parseInt(event.target.value, 10);
    const usuarioSeleccionado = this.usuarios.find((usuario) => usuario.fotocheck === fotocheckSeleccionado);
    if (usuarioSeleccionado) {
        if (usuarioSeleccionado.cargo === 'TECNICO') {
            this.rutaFirmaSeleccionada = usuarioSeleccionado.firma;
            this.correoSeleccionado = usuarioSeleccionado.usuario;
            this.idLider = usuarioSeleccionado.idUsuario
            console.log("idLider" , this.idLider)
        } else if (usuarioSeleccionado.cargo === 'SUPERVISOR') {
            // Manejar el caso en que el usuario es un SUPERVISOR
            console.error('Error: El usuario seleccionado no puede ser un SUPERVISOR.');
        } else {
            // Manejar cualquier otro caso de cargo no deseado
            console.error(`Error: El cargo del usuario no es válido para esta operación: ${usuarioSeleccionado.cargo}`);
        }
    } else {
        console.error('Usuario no encontrado.');
    }
  }

  seleccionarSupervisor(event: any) {
    const fotocheckSeleccionado1 = parseInt(event.target.value, 10);
    const usuarioSeleccionado = this.usuarios.find((usuario) => usuario.fotocheck === fotocheckSeleccionado1);

    if (usuarioSeleccionado) {
      console.log("Usuario seleccionado:", usuarioSeleccionado);
      this.idSupervisor = usuarioSeleccionado.idUsuario; // Cambiar aquí a idUsuario
      console.log("idSupervisor",this.idSupervisor)
      if (this.idSupervisor !== undefined) {
        console.log("ID del usuario seleccionado:", this.idSupervisor);

        if (usuarioSeleccionado.cargo === 'SUPERVISOR') {
          this.correoSeleccionado1 = usuarioSeleccionado.usuario;
        } else {
          console.error(`Error: Operación válida solo para supervisores, cargo actual: ${usuarioSeleccionado.cargo}`);
        }
      } else {
        console.error('ID de usuario no encontrado en el usuario seleccionado.');
      }
    } else {
      console.error('Usuario no encontrado.');
    }
  }

  calcularEstado(): string {
    const valores = [
      this.getInputValue(0),
      this.getInputValue(1),
      this.getInputValue(2),
      this.getInputValue(3)
    ];

    // Verifica si alguno de los valores es mayor a 25
    if (valores.some(valor => valor > 25)) {
      // Si al menos uno es mayor a 25, retorna 'MALO'
      return 'MALO';
    } else if (valores.every(valor => valor <= 25)) {
      // Si todos son menores o iguales a 25, retorna 'BUENO'
      return 'BUENO';
    } else {
      // Si no se cumplen las condiciones anteriores, retorna 'REGULAR'
      return 'REGULAR';
    }
  }
  onGenerarPdfButtonClick(): void {
    console.log("hola");
    this.subestacionService.getPdfBySubestacion(this.tagSubestacion).subscribe(
      (pdfBlob: Blob) => {
        const blobUrl = URL.createObjectURL(pdfBlob);

        // Abrir el PDF en una nueva pestaña
        const newTab = window.open();
        if (newTab) {
          newTab.location.href = blobUrl;
        } else {
          console.error('No se pudo abrir una nueva pestaña.');
          this.alertservice.error('No se pudo abrir el PDF en una nueva pestaña.', 'error');
        }
      },
      error => {
        console.error('Error inesperado', error);
        this.alertservice.error('No se encontró el Plano.', 'error');
      }
    );
  }



  async insertarSpt2(): Promise<void> {

  this.modal.confirm({
    nzTitle: 'Confirmación',
    nzContent: '¿Estás seguro de que quieres guardar los datos?',
    nzOkText: 'Aceptar',
    nzCancelText: 'Cancelar',
    nzOnOk: async () => {
      const loadingMessageId = this.messageService.loading('Evaluando los datos, por favor espera...', { nzDuration: 0 }).messageId;

    try {

      // Capturar las imágenes de esquema_caida y esquema_selectivo
      const esquemaCaida = await this.enviarImagencaida(); // Devuelve un File
      const esquemaSelectivo = await this.enviarImagenselectivo(); // Devuelve un File
      // Convertir la fecha al formato dd-MM-yyyy antes de guardarla
      const fechaFormateada = this.convertirFechaFormato(this.fecha);

        // Tipificar las propiedades para MetodoCaida
          // Estructura original con pat1, pat2, etc.
        // Estructura original con pat1, pat2, etc.
const metodosCaidaOriginal: {
  pat1: number[],
  pat2: number[],
  pat3: number[],
  pat4: number[],
  ohm: number[],
  resultado: string[]
} = {
  pat1: [],
  pat2: [],
  pat3: [],
  pat4: [],
  ohm: [],
  resultado: []
};

// Llenar valores en metodosCaidaOriginal
for (let i = 0; i < this.caidaValues.length; i++) {
  const value = parseFloat(this.caidaValues[i]?.toString()) || 0;
  if (i < 3) {
    metodosCaidaOriginal.pat1.push(value);
  } else if (i < 6) {
    metodosCaidaOriginal.pat2.push(value);
  } else if (i < 9) {
    metodosCaidaOriginal.pat3.push(value);
  } else {
    metodosCaidaOriginal.pat4.push(value);
  }
}

for (let j = 0; j < Math.ceil(this.caidaValues.length / 3); j++) {
  metodosCaidaOriginal.ohm.push(this.calcularPromedioCaida(j) || 0);
  metodosCaidaOriginal.resultado.push(this.getResultadoCaida(j)?.mensaje || 'desconocido');
}

// Definir tipo explícito para `metodosCaida`
const metodosCaida: {
  pat_data: { pat1: number; pat2: number; pat3: number; pat4: number }[],
  ohm_data: { ohm: number; resultado: string }[]
} = {
  pat_data: [],
  ohm_data: []
};

// Transformar los datos de `metodosCaidaOriginal` a `metodosCaida.pat_data`
for (let i = 0; i < metodosCaidaOriginal.pat1.length; i++) {
  metodosCaida.pat_data.push({
    pat1: metodosCaidaOriginal.pat1[i],
    pat2: metodosCaidaOriginal.pat2[i],
    pat3: metodosCaidaOriginal.pat3[i],
    pat4: metodosCaidaOriginal.pat4[i]
  });
}

// Transformar los datos de `metodosCaidaOriginal` a `metodosCaida.ohm_data`
for (let i = 0; i < metodosCaidaOriginal.ohm.length; i++) {
  metodosCaida.ohm_data.push({
    ohm: metodosCaidaOriginal.ohm[i],
    resultado: metodosCaidaOriginal.resultado[i]
  });
}




        // Tipificar las propiedades para MetodoSelectivo
        // Estructura original con pat1, pat2, etc.
const metodosSelectivosOriginal: {
  pat1: string[],
  pat2: string[],
  pat3: string[],
  pat4: string[],
  ohm: string[],
  resultado: string[]
} = {
  pat1: [],
  pat2: [],
  pat3: [],
  pat4: [],
  ohm: [],
  resultado: []
};

// Llenar valores en metodosSelectivosOriginal
for (let i = 0; i < this.selectivoValues.length; i++) {
  const value = (this.selectivoValues[i] || '').toString();
  if (i < 3) {
    metodosSelectivosOriginal.pat1.push(value);
  } else if (i < 6) {
    metodosSelectivosOriginal.pat2.push(value);
  } else if (i < 9) {
    metodosSelectivosOriginal.pat3.push(value);
  } else {
    metodosSelectivosOriginal.pat4.push(value);
  }
}

for (let j = 0; j < Math.ceil(this.selectivoValues.length / 3); j++) {
  metodosSelectivosOriginal.ohm.push(this.calcularPromedioSelectivo(j).toString());
  metodosSelectivosOriginal.resultado.push(this.getResultadoSelectivo(j)?.mensaje || "desconocido");
}

// Definir tipo explícito para `metodosSelectivos`
const metodosSelectivos: {
  pat_data: { pat1: string; pat2: string; pat3: string; pat4: string }[],
  ohm_data: { ohm: string; resultado: string }[]
} = {
  pat_data: [],
  ohm_data: []
};

// Transformar los datos de `metodosSelectivosOriginal` a `metodosSelectivos.pat_data`
for (let i = 0; i < metodosSelectivosOriginal.pat1.length; i++) {
  metodosSelectivos.pat_data.push({
    pat1: metodosSelectivosOriginal.pat1[i],
    pat2: metodosSelectivosOriginal.pat2[i],
    pat3: metodosSelectivosOriginal.pat3[i],
    pat4: metodosSelectivosOriginal.pat4[i]
  });
}

// Transformar los datos de `metodosSelectivosOriginal` a `metodosSelectivos.ohm_data`
for (let i = 0; i < metodosSelectivosOriginal.ohm.length; i++) {
  metodosSelectivos.ohm_data.push({
    ohm: metodosSelectivosOriginal.ohm[i],
    resultado: metodosSelectivosOriginal.resultado[i]
  });
}


        // Tipificar las propiedades para Sujecion
        // Estructura original con solo `ohm`
const patsSujecionOriginal: {
  ohm: number[]
} = {
  ohm: []
};

// Llenar `ohm` en patsSujecionOriginal
for (let i = 0; i < this.inputValues.length; i++) {
  const value = parseFloat(this.inputValues[i]?.toString()) || 0;
  patsSujecionOriginal.ohm.push(value);
}

// Transformar a formato de la API


const patsSujecion: {
  ohm_data: { ohm: number; resultado: string }[]
} = {
  ohm_data: []
};



// Llenar `ohm_data`
for (let i = 0; i < patsSujecionOriginal.ohm.length; i++) {
  const ohmValue = patsSujecionOriginal.ohm[i];
  const resultado = ohmValue < 25 ? "CUMPLE" : "  No CUMPLE"; // Evalúa si cumple o no

  patsSujecion.ohm_data.push({
    ohm: ohmValue,
    resultado: resultado // Asigna el resultado evaluado
  });
}




const spt2Data: InsertSpt2 = {
  Ot: this.ot,
  Fecha: fechaFormateada,
  Firmado: false,
  IdUsuario: this.idLider ?? 0,
  IdUsuario2: this.idSupervisor ?? 0,
  IdSubestacion: this.id_subestacion ?? 0,
  CaidaPotencia: this.checkcaida,
  Selectivo: this.checkpotencial,
  SinPicas: this.checksinpicas,
  FechaCalibracion: this.fecha_calibracion,
  Marca: this.marca,
  NumeroSerie: this.n_serie,
  Modelo: this.modelo,
  Frecuencia: this.frecuencia,
  Precision: this.precision,
  ConclusionesSujecion: this.conclusionespat,
  JsonPatsSelectivo: JSON.stringify(metodosSelectivos),
  JsonPatsCaida: JSON.stringify(metodosCaida),
  JsonPatsSujecion: JSON.stringify(patsSujecion),
  ConclusionesCaida: this.conclucioncaida || '',
  ConclusionesSelectivo: this.conclucionselectivo || '',
  Imagen1: this.files[0] || null,
  Imagen2: this.files[1] || null,
  Imagen3: this.files[2] || null,
  Imagen4: this.files[3] || null,
  EsquemaCaida: esquemaCaida || null,
  EsquemaSelectivo: esquemaSelectivo || null,
};

const formData = new FormData();

// Agregar campos al FormData
Object.keys(spt2Data).forEach((key) => {
  if (spt2Data[key] !== undefined && spt2Data[key] !== null) {
    // Si es un archivo, lo agregamos directamente
    if (spt2Data[key] instanceof File) {
      formData.append(key, spt2Data[key]);
    } else {
      // Si es un objeto o array, lo convertimos a JSON
      if (typeof spt2Data[key] === 'object') {
        formData.append(key, JSON.stringify(spt2Data[key]));
      } else {
        formData.append(key, spt2Data[key].toString());
      }
    }
  }
});

try {
  console.log("Datos enviados a la API:", spt2Data);
  const response = await this.spt2Service.insertarSpt2(formData).toPromise(); // Enviar formData
  if (response.idSpt2) {
    console.log("Respuesta recibida:", response);

    const notificacion: Notificacion = {
      supervisor: this.idSupervisor ?? 0,
      lider: this.idLider ?? 0,
      firmado: false,
      id_spt2: response.idSpt2,
    };
    console.log("Datos de notificación:", notificacion);

    await this.notificacionService.insertarNotificacionSpt1(notificacion).toPromise();
    console.log("Notificación guardada correctamente");

    this.messageService.remove(loadingMessageId);
    this.alertservice.success('Datos Guardados', 'Los datos se han guardado con éxito.');
  } else {
    throw new Error('No se pudo obtener el ID de la spt1');
  }
} catch (error) {
  this.handleErrorInterno(error, 'insertarSpt2', loadingMessageId);
}
    } catch (error) {
      console.error("Error al procesar datos del formulario:", error);
      this.messageService.remove(loadingMessageId);

    }
  }
});
}


handleErrorInterno(error: any, context: string, loadingMessageId: string) {
  console.error(`Error en ${context}:`, error);
  this.messageService.remove(loadingMessageId);

  // Mostramos el error completo en la alerta
  this.alertservice.error('Error al Guardar', error.message);
}


  // Método para convertir la fecha al formato dd-MM-yyyy
    convertirFechaFormato(fecha: string): string {
      if (!fecha) return ''; // Verificación si la fecha está vacía

      const [year, month, day] = fecha.split('-');
      return `${day}-${month}-${year}`;
    }



}
