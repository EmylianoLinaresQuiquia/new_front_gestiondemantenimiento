import { Component, OnDestroy,ViewChild, OnChanges, SimpleChanges ,ViewContainerRef } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../interface/usuario';
import { UsuarioService } from '../../services/usuario.service';

import { SubestacionService } from '../../services/subestacion.service';
import { Subestacion } from '../../interface/subestacion';
import { Spt2 } from '../../interface/spt2';
import { Spt2Service } from '../../services/spt2.service';
import { MetodoCaida } from '../../interface/metodo-caida';
import { MetodoCaidaService } from '../../services/metodo-caida.service';
import { MetodoSelectivo } from '../../interface/metodo-selectivo';
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
  marca = '';
  nserie  = '';
  modelo  = '';
  frecuencia  = '';
  precision  = '';
  cantidad_spt : number | null = null;
  r1 : number | null = null;
  r2  : number | null = null;
  r3 : number | null = null;
  conclucioncaida = '';
  r4 : number | null = null;
  r5 : number | null = null;
  r6 : number | null = null;
  idusuario = 0

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

    if (!this.chart) {
        console.error('Failed to create chart instance.');
        return;
    }

    const valuesPerCategory = 3;  // Número de valores por cada PAT
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
            dataPoint[category] = this.caidaValues[index * valuesPerCategory + i];
        });
        chartData.push(dataPoint);
    }

    console.log('Chart data:', chartData);
    this.chart.data = chartData;

    const categoryAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'category';  // Categorías del eje X ahora son 'Value 1', 'Value 2', etc.

    // Deshabilitar etiquetas del eje X
    categoryAxis.renderer.labels.template.disabled = true;

    const valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;

    const range = valueAxis.axisRanges.create();
    range.value = 25;
    range.grid.stroke = am4core.color('red');
    range.grid.strokeWidth = 2;
    range.grid.strokeOpacity = 1;

    const patColors: { [key: string]: string } = {
        'PAT1': 'blue',
        'PAT2': 'green',
        'PAT3': 'orange',
        'PAT4': 'purple'
    };

    // Crear series dinámicamente para cada categoría (PAT)
    if (this.chart) {
        categories.forEach((category) => {
            const series = this.chart!.series.push(new am4charts.LineSeries());
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

            const labelBullet = series.bullets.push(new am4charts.LabelBullet());
            labelBullet.label.text = '{valueY}';
            labelBullet.label.dy = -10;
            labelBullet.label.fontSize = 12;
        });
    }

    // Agregar leyenda al gráfico
    this.chart.legend = new am4charts.Legend();

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
  mensaje: promedio > 25 ? 'MALO' : (promedio <= 25 && valoresFiltrados.length > 0 ? 'BUENO' : ''),
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

  if (!this.selectivochart) {
      console.error('Failed to create chart instance.');
      return;
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
      'PAT1': 'blue',
        'PAT2': 'green',
        'PAT3': 'orange',
        'PAT4': 'purple'
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

          const labelBullet = series.bullets.push(new am4charts.LabelBullet());
          labelBullet.label.text = '{valueY}';
          labelBullet.label.dy = -10;
          labelBullet.label.fontSize = 11;
      });
  }

  // Agregar leyenda al gráfico
  this.selectivochart.legend = new am4charts.Legend();

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

  enviarImagencaida(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      const chartId = 'caida-chart';
      const fileName = 'caida-chart.png';

      const formData = new FormData();
      this.captureChartAsImage(chartId, fileName, (blob: Blob) => {
        formData.append('grafica', blob, fileName);

        this.MetodoCaidaGraficaService.insertarGrafica(formData).subscribe(
          (response) => {
            console.log(response);
            resolve(response);  // Asegúrate de que 'response' contiene el ID
          },
          (error) => {
            console.error(error);
            reject(error);
          }
        );
      });
    });
  }

  enviarImagenselectivo(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      const chartId = 'selectivo-chart';
      const fileName = 'selectivo-chart.png';

      const formData = new FormData();
      this.captureChartAsImage(chartId, fileName, (blob: Blob) => {
        formData.append('grafica', blob, fileName);

        this.MetodoSelectivoGraficaService.insertarGrafica(formData).subscribe(
          (response) => {
            console.log(response);
            resolve(response);  // Asegúrate de que 'response' contiene el ID
          },
          (error) => {
            console.error(error);
            reject(error);
          }
        );
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
          mensaje: promedio > 25 ? 'MALO' : (promedio <= 25 && valoresFiltrados.length > 0 ? 'BUENO' : ''),
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
      this.idusuario = usuarioSeleccionado.idUsuario; // Cambiar aquí a idUsuario

      if (this.idusuario !== undefined) {
        console.log("ID del usuario seleccionado:", this.idusuario);

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
    console.log("hola")
    this.subestacionService.getPdfBySubestacion(this.tagSubestacion).subscribe(
      (pdfBlob: Blob) => {
        const blobUrl = URL.createObjectURL(pdfBlob);
        this.modal.create({
          nzContent: PdfViewerComponent,

          nzData: {
            pdfSrc: blobUrl // Pasas el PDF como parámetro al componente
          },
          nzWidth: '95%',
          nzBodyStyle: {
            height: '1%',
            overflow: 'hidden'
          }
        });
      },
      error => {
        console.error('Error inesperado', error);
        this.alertservice.showAlert('No se encontró el Plano.', 'error');
      }
    );
  }

  guardarDatos(): void {
    this.modal.confirm({
      nzTitle: 'Confirmación',
      nzContent: '¿Estás seguro de que quieres guardar los datos?',
      nzOnOk: async () => {
        const loadingMessageId = this.messageService.loading('Evaluando los datos, por favor espera...', { nzDuration: 0 }).messageId;
            try {


                // Primero, crear y enviar los datos para MetodoCaida
                const metodoCaida1: MetodoCaida = {
                    r1mc: (this.caidaValues[0] || '').toString(),
                    r2mc: (this.caidaValues[1] || '').toString(),
                    r3mc: (this.caidaValues[2] || '').toString(),
                    valormc: this.calcularPromedioCaida(0).toString(),
                    resultadomc: this.getResultadoCaida(0)?.mensaje,
                    conclusionesmc: this.conclucioncaida || ''
                };

                const metodoCaida2: MetodoCaida = {
                    r1mc: this.caidaValues[3]?.toString() || '',
                    r2mc: this.caidaValues[4]?.toString() || '',
                    r3mc: this.caidaValues[5]?.toString() || '',
                    valormc: this.calcularPromedioCaida(1).toString(),
                    resultadomc: this.getResultadoCaida(1)?.mensaje,
                    conclusionesmc: this.conclucioncaida || ''
                };

                const metodoCaida3: MetodoCaida = {
                    r1mc: this.caidaValues[6]?.toString() || '',
                    r2mc: this.caidaValues[7]?.toString() || '',
                    r3mc: this.caidaValues[8]?.toString() || '',
                    valormc: this.calcularPromedioCaida(2).toString(),
                    resultadomc: this.getResultadoCaida(2)?.mensaje,
                    conclusionesmc: this.conclucioncaida || ''
                };

                const metodoCaida4: MetodoCaida = {
                    r1mc: this.caidaValues[9]?.toString() || '',
                    r2mc: this.caidaValues[10]?.toString() || '',
                    r3mc: this.caidaValues[11]?.toString() || '',
                    valormc: this.calcularPromedioCaida(3).toString(),
                    resultadomc: this.getResultadoCaida(3)?.mensaje,
                    conclusionesmc: this.conclucioncaida || ''
                };

                const responseCaida = await this.metodoCaidaService.insertarMetodoCaida([metodoCaida1, metodoCaida2, metodoCaida3, metodoCaida4]).toPromise();
                const insertedId = responseCaida!.insertedId as number;

                const metodoSelectivo1: MetodoSelectivo = {
                    r1ms: (this.selectivoValues[0] || '').toString(),
                    r2ms: (this.selectivoValues[1] || '').toString(),
                    r3ms: (this.selectivoValues[2] || '').toString(),
                    valorms: this.calcularPromedioSelectivo(0).toString(),
                    resultadoms: this.getResultadoSelectivo(0)?.mensaje,
                    conclusionesms: this.conclucionselectivo || ''
                };

                const metodoSelectivo2: MetodoSelectivo = {
                    r1ms: (this.selectivoValues[3] || '').toString(),
                    r2ms: (this.selectivoValues[4] || '').toString(),
                    r3ms: (this.selectivoValues[5] || '').toString(),
                    valorms: this.calcularPromedioSelectivo(1).toString(),
                    resultadoms: this.getResultadoSelectivo(1)?.mensaje,
                    conclusionesms: this.conclucionselectivo || ''
                };

                const metodoSelectivo3: MetodoSelectivo = {
                    r1ms: (this.selectivoValues[6] || '').toString(),
                    r2ms: (this.selectivoValues[7] || '').toString(),
                    r3ms: (this.selectivoValues[8] || '').toString(),
                    valorms: this.calcularPromedioSelectivo(2).toString(),
                    resultadoms: this.getResultadoSelectivo(2)?.mensaje,
                    conclusionesms: this.conclucionselectivo || ''
                };

                const metodoSelectivo4: MetodoSelectivo = {
                    r1ms: (this.selectivoValues[9] || '').toString(),
                    r2ms: (this.selectivoValues[10] || '').toString(),
                    r3ms: (this.selectivoValues[11] || '').toString(),
                    valorms: this.calcularPromedioSelectivo(3).toString(),
                    resultadoms: this.getResultadoSelectivo(3)?.mensaje,
                    conclusionesms: this.conclucionselectivo || ''
                };

                const responseSelectivo = await this.metodoSelectivoService.insertarMetodoSelectivo([metodoSelectivo1, metodoSelectivo2, metodoSelectivo3, metodoSelectivo4]).toPromise();
                const idSelectivo = responseSelectivo!.insertedId as number;

                const formData = new FormData();
                this.files.forEach((file, index) => {
                    formData.append(`imagen${index + 1}`, file, file.name);
                });

                const responseReporte = await this.ReportefotograficoService.insertarReporteFotografico(formData).toPromise();
                const idReporteFoto = responseReporte as number;

                const idcaidagrafica = await this.enviarImagencaida();
                const idselectivografica = await this.enviarImagenselectivo();

                const metodomedicion: MetodoMedicion = {
                  caidaPotencia: this.checkcaida,
                  selectivo: this.checkpotencial,
                  sinPicas: this.checksinpicas
                };

                const responsemetodomedicion = await this.MetodoMedicionService.insertarMetodoMedicion(metodomedicion).toPromise();
                const idMetodoMedicion = responsemetodomedicion.insertedId as number;

                console.log('Datos de metodoMedicion:', metodomedicion);
                console.log("idMetodoMedicion", idMetodoMedicion);

                if (idMetodoMedicion === undefined || idMetodoMedicion === null) {
                    throw new Error("El idMetodoMedicion es undefined o null");
                }
                // Nuevo Proceso: Inserción de Medicion Telurometro
                const medicion: MedicionTelurometro = {
                  frecuencia: '111,128 Hz',  // Datos de ejemplo, pueden ser dinámicos
                  fecha_calibracion: '02/21/23',
                  precision: '+/- 5%',
                  n_serie: 'ST181415734 B4',
                  marca: 'Fluke',
                  modelo: '1625-2'
                };

                const responseMedicion = await this.MedicionTelurometroService.insertarMedicion(medicion).toPromise();
                const idMedicionTelurometro = responseMedicion!.insertedId as number;
                console.log("medicion",medicion)
                console.log("idMedicionTelurometro",idMedicionTelurometro)

                const spt2Data: Spt2 = {
                    tag_subestacion: this.tagSubestacion,
                    ot: this.ot,
                    fecha: this.fecha,
                    pat1: this.inputValues[0] ? this.inputValues[0].toString() : '',
                    pat2: this.inputValues[1] ? this.inputValues[1].toString() : '',
                    pat3: this.inputValues[2] ? this.inputValues[2].toString() : '',
                    pat4: this.inputValues[3] ? this.inputValues[3].toString() : '',
                    conclusiones: this.conclusionespat,
                    lider: this.correoSeleccionado,
                    supervisor: this.correoSeleccionado1,
                    firma: false,
                    id_mselectivo: idSelectivo,
                    id_mcaida: insertedId,
                    idreportefoto: idReporteFoto,
                    idgrafica_caida: idcaidagrafica,
                    idgrafica_selectivo: idselectivografica,
                    id_metodomedicion:idMetodoMedicion,
                    id_mtd_medicion_telurometro: idMedicionTelurometro
                };
                console.log("spt2Data",spt2Data)
                const responseSpt2 = await this.spt2Service.insertarSpt2(spt2Data).toPromise();
                this.id_spt2 = responseSpt2.id;

                if (this.idusuario == null || this.idusuario === undefined) {
                    console.error('Error: idUsuario no está definido.');
                    return;
                }

                const nuevaNotificacion: Notificacion = {
                  id_usuario: this.idusuario,
                  id_spt2: this.id_spt2,
                  firmado: false // Si necesitas firmarlo, cambia a true
              };

              await this.notificacionService.insertarNotificacionSpt2(nuevaNotificacion).toPromise();




                this.messageService.remove(loadingMessageId);
                this.notificationService.success(
                    'Datos Guardados',
                    'Los datos se han guardado correctamente.'
                );
            } catch (error) {
              this.messageService.remove(loadingMessageId);
                this.notificationService.error(
                    'Error al Guardar',
                    'Ha ocurrido un error al guardar los datos.'
                );
            }
        }
    });
}
}
