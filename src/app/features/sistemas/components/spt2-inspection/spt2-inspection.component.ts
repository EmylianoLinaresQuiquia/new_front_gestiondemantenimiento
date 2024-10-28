import { Component, OnDestroy,ViewChild, OnChanges, SimpleChanges ,ViewContainerRef } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../interface/usuario';
import { UsuarioService } from '../../services/usuario.service';

import { SubestacionService } from '../../services/subestacion.service';
import { Subestacion } from '../../interface/subestacion';
import { InsertSpt2 } from '../../interface/spt2';
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
    try {

      // Capturar las imágenes de esquema_caida y esquema_selectivo
      const esquemaCaida = await this.enviarImagencaida(); // Devuelve un File
      const esquemaSelectivo = await this.enviarImagenselectivo(); // Devuelve un File



      const spt2Data: InsertSpt2 = {
        ot: this.ot,
        fecha: this.fecha,
        firmado: false,
        id_usuario: this.idLider ?? 0,
        id_usuario_2: this.idSupervisor ?? 0,
        id_subestacion: this.id_subestacion ?? 0,

        caida_potencia: this.checkcaida,
        selectivo: this.checkpotencial,
        sin_picas: this.checksinpicas,

        fecha_calibracion: this.fecha_calibracion,
        marca: this.marca,
        n_serie: this.n_serie,
        modelo: this.modelo,
        frecuencia: this.frecuencia,
        precision: this.precision,

        conclusiones_sujecion: this.conclusionespat,
        pats: [
          { pat1: 1.23, pat2: 2.34, pat3: 3.45, pat4: 4.56, ohm: '10', resultado: 'OK' },
          { pat1: 5.67, pat2: 6.78, pat3: 7.89, pat4: 8.90, ohm: '20', resultado: 'FAIL' }
        ],
        esquema_caida: esquemaCaida,
        conclusiones_caida: this.conclucioncaida || '',
        esquema_selectivo: esquemaSelectivo,
        conclusiones_selectivo: this.conclucionselectivo || '',

        imagen1: this.files[0] || null,
        imagen2: this.files[1] || null,
        imagen3: this.files[2] || null,
        imagen4: this.files[3] || null,
      };

      const formData = new FormData();

      // Agregar campos de texto al FormData
      formData.append('Ot', spt2Data.ot);
      formData.append('Fecha', spt2Data.fecha.toString());
      formData.append('Firmado', spt2Data.firmado.toString());
      formData.append('IdUsuario', spt2Data.id_usuario.toString());
      formData.append('IdUsuario2', spt2Data.id_usuario_2.toString());
      formData.append('IdSubestacion', spt2Data.id_subestacion.toString());
      formData.append('CaidaPotencia', spt2Data.caida_potencia.toString());
      formData.append('Selectivo', spt2Data.selectivo.toString());
      formData.append('SinPicas', spt2Data.sin_picas.toString());
      formData.append('FechaCalibracion', spt2Data.fecha_calibracion.toString());
      formData.append('Marca', spt2Data.marca);
      formData.append('NSerie', spt2Data.n_serie);
      formData.append('Modelo', spt2Data.modelo);
      formData.append('Frecuencia', spt2Data.frecuencia);
      formData.append('Precision', spt2Data.precision);
      formData.append('ConclusionesSujecion', spt2Data.conclusiones_sujecion);
      formData.append('ConclusionesCaida', spt2Data.conclusiones_caida);
      formData.append('ConclusionesSelectivo', spt2Data.conclusiones_selectivo);

      // Añadir las imágenes
      if (spt2Data.imagen1) {
        formData.append('Imagen1', spt2Data.imagen1, spt2Data.imagen1.name);
      }
      if (spt2Data.imagen2) {
        formData.append('Imagen2', spt2Data.imagen2, spt2Data.imagen2.name);
      }
      if (spt2Data.imagen3) {
        formData.append('Imagen3', spt2Data.imagen3, spt2Data.imagen3.name);
      }
      if (spt2Data.imagen4) {
        formData.append('Imagen4', spt2Data.imagen4, spt2Data.imagen4.name);
      }

      // Añadir los esquemas
      if (spt2Data.esquema_caida) {
        formData.append('EsquemaCaida', spt2Data.esquema_caida, spt2Data.esquema_caida.name);
      }
      if (spt2Data.esquema_selectivo) {
        formData.append('EsquemaSelectivo', spt2Data.esquema_selectivo, spt2Data.esquema_selectivo.name);
      }

      // Convertir el array de pats a JSON y agregarlo al FormData
      formData.append('JsonPats', JSON.stringify({ pats: spt2Data.pats }));

      // Mostrar el contenido de formData
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      this.spt2Service.insertarSpt2(formData).subscribe(
        response => {
          console.log('Éxito:', response); // Aquí deberías ver la respuesta con idSpt2
          if (response.idSpt2) {
            console.log('Inserción exitosa. ID:', response.idSpt2);
          } else {
            console.error('Inserción fallida. No se recibió ID.');
          }
        },
        error => {
          console.error('Error al enviar los datos:', error);
          if (error.error && error.error.message) {
            console.error('Mensaje de error:', error.error.message);
          }
        }
      );
    } catch (error) {
      console.error('Error al procesar las imágenes:', error);
    }
  }





}
