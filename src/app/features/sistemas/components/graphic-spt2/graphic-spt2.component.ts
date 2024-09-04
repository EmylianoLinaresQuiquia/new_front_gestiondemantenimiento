import { MetodoCaidaService } from './../../services/metodo-caida.service';
import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashSpt2Service } from '../../services/dash-spt2.service';
import { MetodoSelectivoService } from '../../services/metodo-selectivo.service';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);
@Component({
  selector: 'app-graphic-spt2',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './graphic-spt2.component.html',
  styleUrl: './graphic-spt2.component.css'
})
export class GraphicSpt2Component implements OnInit{
  tagSubestacion: string = '';
  r1mcpromedioValues: number[] = [];
  r2mcpromedioValues: number[] = [];
  r3mcpromedioValues: number[] = [];
  r4mcpromedioValues: number[] = [];

  r1mspromedioValues: number[] = [];
  r2mspromedioValues: number[] = [];
  r3mspromedioValues: number[] = [];
  r4mspromedioValues: number[] = [];

  resultados: any[] = [];

  constructor(
    private dashSpt2Service: DashSpt2Service,
    private MetodoCaidaService: MetodoCaidaService,
    private MetodoSelectivoService: MetodoSelectivoService,
  ) {}

  ngOnInit() {
    this.dashSpt2Service.resultadosBúsqueda$.subscribe(
      (resultados) => {
        console.log("Resultados recibidos:", resultados);
        if (resultados && resultados.length > 0) {
          this.resultados = resultados;
          this.handleResultados(resultados);
          resultados.forEach((res) => {
            console.log("Valores específicos - pat1:", res.pat1, "pat2:", res.pat2, "pat3:", res.pat3, "pat4:", res.pat4);
          });
        }
      },
      (error) => {
        console.error('Error al suscribirse a resultadosBúsqueda$:', error);
      }
    );
  }

  private handleResultados(resultados: any[]) {
    this.tagSubestacion = resultados[0].tag_subestacion;
    this.fetchMetodoCaidaData(resultados[0].id_mcaida);
    this.fetchMetodoSelectivoData(resultados[0].id_mselectivo);

    if (!this.areAllResultadosEmpty(resultados)) {
      this.renderChart3(resultados);
    } else {
      console.log('Todos los resultados son vacíos. No se mostrará el gráfico.');
    }
  }

  private fetchMetodoCaidaData(id: number) {
    this.MetodoCaidaService.getMetodoCaidaById(id).subscribe(
      (metodoCaidaData) => {
        console.log('Datos Método Caída:', metodoCaidaData);
        this.updateMetodoCaidaValues(metodoCaidaData);
        this.renderChart1();
      },
      (error) => console.error('Error al obtener información del método de caída:', error)
    );
  }

  private fetchMetodoSelectivoData(id: number) {
    this.MetodoSelectivoService.getMetodoSelectivoById(id).subscribe(
      (metodoSelectivoData) => {
        console.log('Datos Método Selectivo:', metodoSelectivoData);
        this.updateMetodoSelectivoValues(metodoSelectivoData);
        this.renderChart2();
      },
      (error) => console.error('Error al obtener información del método de selectivo:', error)
    );
  }

  private updateMetodoCaidaValues(data: any[]) {
    [this.r1mcpromedioValues, this.r2mcpromedioValues, this.r3mcpromedioValues, this.r4mcpromedioValues] = data.map(
      (item) => [parseInt(item.valormc, 10)]
    );
  }

  private updateMetodoSelectivoValues(data: any[]) {
    [this.r1mspromedioValues, this.r2mspromedioValues, this.r3mspromedioValues, this.r4mspromedioValues] = data.map(
      (item) => [parseInt(item.valorms, 10)]
    );
  }

  private areAllResultadosEmpty(resultados: any[]): boolean {
    return resultados.every((resultado) =>
      Object.values(resultado).every((value) => value === null || value === undefined)
    );
  }

  private renderChart(chartId: string, title: string, seriesData: number[][], fechas: string[]) {
    const chartElement = am4core.create(chartId, am4charts.XYChart);
    chartElement.paddingRight = 20;

    // Agregar título al gráfico
    const chartTitle = chartElement.titles.create();
    chartTitle.text = title;  // Usa el parámetro `title` como el título del gráfico
    chartTitle.fontSize = 25; // Tamaño de fuente del título
    chartTitle.marginBottom = 20; // Margen inferior del título
    chartTitle.align = "center"; // Alinear el título al centro

    chartElement.data = fechas.map((fecha, index) => {
        let data: { [key: string]: any } = { fecha: fecha };

        seriesData.forEach((serie, i) => {
            const value = serie[index]; // El valor ya es un número
            if (!isNaN(value)) {
                data[`pat${i + 1}`] = value;
            }
        });
        return data;
    });

    const categoryAxis = chartElement.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "fecha";
    categoryAxis.title.text = "Fecha";

    const valueAxis = chartElement.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Valores";

    // Ajustar automáticamente el rango del eje Y
    valueAxis.strictMinMax = false;  // Permitir que el gráfico ajuste el rango automáticamente
    valueAxis.min = 0;  // Puedes establecer un valor mínimo si deseas que el eje Y siempre empiece en 0

    seriesData.forEach((serie, index) => {
        const hasData = serie.some(value => !isNaN(value));
        if (!hasData) return;

        const series = chartElement.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = `pat${index + 1}`;
        series.dataFields.categoryX = "fecha";
        series.name = `PAT${index + 1}`;
        series.tooltipText = "{name}: [bold]{valueY}[/]";
        series.strokeWidth = 2;
        series.minBulletDistance = 10;

        const bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.radius = 4;
        bullet.circle.strokeWidth = 2;
        bullet.circle.fill = am4core.color("#fff");

        const label = bullet.createChild(am4core.Label);
        label.text = "{valueY}";
        label.verticalCenter = "bottom";
        label.dy = -10;
    });

    chartElement.cursor = new am4charts.XYCursor();
    chartElement.legend = new am4charts.Legend();
    chartElement.exporting.menu = new am4core.ExportMenu();
}




  private renderChart1() {
    const metodoCaidaElement = document.getElementById('metodo-caida');
    if (!metodoCaidaElement) {
      console.error('Elemento con ID "metodo-caida" no encontrado.');
      return;
    }

    const seriesData = [this.r1mcpromedioValues, this.r2mcpromedioValues, this.r3mcpromedioValues, this.r4mcpromedioValues];
    if (this.areSeriesDataEmpty(seriesData)) {
      console.log('Método Caída: No hay datos para mostrar.');
      metodoCaidaElement.style.display = 'none';
    } else {
      metodoCaidaElement.style.display = 'block';
      this.renderChart('metodo-caida', 'Método Caida', seriesData, this.getFormattedFechas());
    }
  }

  private renderChart2() {
    const metodoSelectivoElement = document.getElementById('metodo-selectivo');
    if (!metodoSelectivoElement) {
      console.error('Elemento con ID "metodo-selectivo" no encontrado.');
      return;
    }

    if (this.areSeriesDataEmpty([this.r1mspromedioValues, this.r2mspromedioValues, this.r3mspromedioValues, this.r4mspromedioValues])) {
      console.log('Método Selectivo: No hay datos para mostrar.');
      metodoSelectivoElement.style.display = 'none';
    } else {
      metodoSelectivoElement.style.display = 'block';
      this.renderChart('metodo-selectivo', 'Método Selectivo', [this.r1mspromedioValues, this.r2mspromedioValues, this.r3mspromedioValues, this.r4mspromedioValues], this.getFormattedFechas());
    }
  }

  private renderChart3(resultados: any[]) {
    const sinPicasElement = document.getElementById('sin-picas');
    if (!sinPicasElement) {
        console.error('Elemento con ID "sin-picas" no encontrado.');
        return;
    }

    const seriesData = [
        resultados.map((res) => parseFloat(res.pat1)),
        resultados.map((res) => parseFloat(res.pat2)),
        resultados.map((res) => parseFloat(res.pat3)),
        resultados.map((res) => parseFloat(res.pat4)),
    ];

    if (this.areSeriesDataEmpty(seriesData)) {
        console.log('Método Sin Picas: No hay datos para mostrar.');
        sinPicasElement.style.display = 'none';
    } else {
        sinPicasElement.style.display = 'block';
        const fechasFormateadas = this.getFormattedFechas();
        console.log('Fechas formateadas para el gráfico:', fechasFormateadas);
        this.renderChart('sin-picas', 'Metodo sin Picas', seriesData, fechasFormateadas);
    }
}



  private areSeriesDataEmpty(seriesData: number[][]): boolean {
    const isEmpty = seriesData.every(serie => serie.every(value => value === null || value === undefined || isNaN(value) || value === 0));
    console.log("Series data vacíos:", isEmpty, seriesData);
    return isEmpty;
  }


  private getFormattedFechas(): string[] {
    console.log('Iniciando el formateo de fechas...');

    const fechasUnicas = [...new Set(this.resultados.map((resultado) => {
        console.log(`Procesando fecha: ${resultado.fecha}`);
        let fecha: string | null = null;

        // Tomar la fecha tal cual se recibe
        if (resultado.fecha.includes('-') || resultado.fecha.includes('/')) {
            fecha = resultado.fecha;
        } else {
            console.warn(`Formato de fecha no reconocido: ${resultado.fecha}`);
        }

        return fecha;
    }).filter(fecha => fecha !== null))];

    console.log('Fechas únicas antes de ordenar:', fechasUnicas);

    // Opcional: Si deseas ordenar las fechas cronológicamente:
    fechasUnicas.sort((a, b) => new Date(a!).getTime() - new Date(b!).getTime());

    console.log('Fechas únicas después de ordenar:', fechasUnicas);
    return fechasUnicas;
}




}
