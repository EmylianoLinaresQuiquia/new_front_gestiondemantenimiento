import { MetodoCaidaService } from './../../services/metodo-caida.service';
import { Component } from '@angular/core';
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
export class GraphicSpt2Component {
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
    this.dashSpt2Service.resultadosBúsqueda$.subscribe((resultados) => {
      if (resultados && resultados.length > 0) {
        this.resultados = resultados;
        this.handleResultados(resultados);
        resultados.forEach((res) => {
          console.log("Valores específicos - pat1:", res.pat1, "pat2:", res.pat2, "pat3:", res.pat3, "pat4:", res.pat4);
        });
      }
    });
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
        this.updateMetodoCaidaValues(metodoCaidaData);
        this.renderChart1();
      },
      (error) => console.error('Error al obtener información del método de caída:', error)
    );
  }

  private fetchMetodoSelectivoData(id: number) {
    this.MetodoSelectivoService.getMetodoSelectivoById(id).subscribe(
      (metodoSelectivoData) => {
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
    
    chartElement.data = fechas.map((fecha, index) => {
      // Define explícitamente el tipo de objeto con un índice de tipo 'string'
      let data: { [key: string]: any } = { fecha: fecha }; 
    
      seriesData.forEach((serie, i) => {
        data[`pat${i + 1}`] = serie[index]; // Usa la notación de template literal correctamente
      });
      return data;
    });
    
    const dateAxis = chartElement.xAxes.push(new am4charts.DateAxis());
    dateAxis.dataFields.date = "fecha";
    dateAxis.title.text = "Fecha";

    const valueAxis = chartElement.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Valores";

    seriesData.forEach((_, index) => {
      const series = chartElement.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = `pat${index + 1}`;
      series.dataFields.dateX = "fecha";
      series.name = `PAT${index + 1}`;
      series.tooltipText = "{name}: [bold]{valueY}[/]";
      series.strokeWidth = 2;
      series.minBulletDistance = 10;
    });

    chartElement.cursor = new am4charts.XYCursor();
    chartElement.legend = new am4charts.Legend();
    chartElement.exporting.menu = new am4core.ExportMenu();
  }

  private renderChart1() {
    this.renderChart('metodo-caida', 'Método Caida', [this.r1mcpromedioValues, this.r2mcpromedioValues, this.r3mcpromedioValues, this.r4mcpromedioValues], this.getFormattedFechas());
  }

  private renderChart2() {
    this.renderChart('metodo-selectivo', 'Método Selectivo', [this.r1mspromedioValues, this.r2mspromedioValues, this.r3mspromedioValues, this.r4mspromedioValues], this.getFormattedFechas());
  }

  private renderChart3(resultados: any[]) {
    const seriesData = [
      resultados.map((res) => parseFloat(res.pat1)),
      resultados.map((res) => parseFloat(res.pat2)),
      resultados.map((res) => parseFloat(res.pat3)),
      resultados.map((res) => parseFloat(res.pat4)),
    ];

    this.renderChart('sin-picas', 'Metodo sin Picas', seriesData, this.getFormattedFechas());
  }

  private getFormattedFechas(): string[] {
    const fechasUnicas = [...new Set(this.resultados.map((resultado) => resultado.fecha))];
    fechasUnicas.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    return fechasUnicas.map((fecha) => {
      const fechaParts = fecha.split('-');
      return `${fechaParts[2]}/${fechaParts[1]}/${fechaParts[0]}`;
    });
  }
} 
