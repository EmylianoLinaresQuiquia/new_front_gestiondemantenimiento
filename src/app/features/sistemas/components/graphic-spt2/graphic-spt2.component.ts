import { Spt2Service } from './../../services/spt2.service';
import { MetodoCaidaService } from './../../services/metodo-caida.service';
import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashSpt2Service } from '../../services/dash-spt2.service';
import { MetodoSelectivoService } from '../../services/metodo-selectivo.service';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { Router, ActivatedRoute } from '@angular/router';
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
  resultados: any[] = [];

  constructor(
    private Spt2Service: Spt2Service,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {

    // Nos suscribimos a los parámetros de la URL
    this.route.queryParams.subscribe(params => {
      this.tagSubestacion = params['tag_subestacion'] || '';
      if (this.tagSubestacion) {
        this.getCaidaData(this.tagSubestacion);
        this.getSelectivoData(this.tagSubestacion);
      this.getSujecionData(this.tagSubestacion);
      } else {
        console.log('No se recibió un tag_subestacion válido.');
      }
    });
  }

  private getCaidaData(tagSubestacion: string) {
    this.Spt2Service.dashboardCaidaSpt2(tagSubestacion).subscribe(data => {
      console.log('Datos de Método Caída:', data);

      const fechas = data.map((res: any) => res.fecha);

      // Declaramos seriesData con el tipo adecuado
      const seriesData: Array<Array<number | null>> = [];

      data.forEach((res: any) => {
        if (res.ohm_caida) {
          const valores = res.ohm_caida.split(',').map((valor: string) => parseFloat(valor.trim()));
          valores.forEach((valor: number, index: number) => {
            if (!seriesData[index]) seriesData[index] = []; // Inicializa cada subarray
            seriesData[index].push(valor); // Agrega el valor parseado a la serie correspondiente
          });
        } else {
          // Si ohm_caida es null, llenamos con null en cada serie para mantener el índice
          seriesData.forEach(serie => serie.push(null));
        }
      });

      if (!this.areSeriesDataEmpty(seriesData)) {
        this.renderChart('metodo-caida', 'Método de Caída', seriesData, fechas);
      } else {
        console.log('Método de Caída: No hay datos para mostrar.');
      }
    });
  }
  private getSelectivoData(tagSubestacion: string) {
    this.Spt2Service.dashboardSelectivoSpt2(tagSubestacion).subscribe(data => {
      console.log('Datos de Método Selectivo:', data);

      const fechas = data.map((res: any) => res.fecha);
      const seriesData: Array<Array<number | null>> = [];

      data.forEach((res: any) => {
        if (res.ohm_selectivo) {
          const valores = res.ohm_selectivo.split(',').map((valor: string) => parseFloat(valor.trim()));
          valores.forEach((valor: number, index: number) => {
            if (!seriesData[index]) seriesData[index] = [];
            seriesData[index].push(valor);
          });
        } else {
          seriesData.forEach(serie => serie.push(null));
        }
      });

      if (!this.areSeriesDataEmpty(seriesData)) {
        this.renderChart('metodo-selectivo', 'Método Selectivo', seriesData, fechas);
      } else {
        console.log('Método Selectivo: No hay datos para mostrar.');
      }
    });
  }

  private getSujecionData(tagSubestacion: string) {
    this.Spt2Service.dashboardSujecionSpt2(tagSubestacion).subscribe(data => {
      console.log('Datos de Método Sujeción:', data);

      const fechas = data.map((res: any) => res.fecha);
      const seriesData: Array<Array<number | null>> = [];

      data.forEach((res: any) => {
        if (res.ohm_sujecion) {
          const valores = res.ohm_sujecion.split(',').map((valor: string) => parseFloat(valor.trim()));
          valores.forEach((valor: number, index: number) => {
            if (!seriesData[index]) seriesData[index] = [];
            seriesData[index].push(valor);
          });
        } else {
          seriesData.forEach(serie => serie.push(null));
        }
      });

      if (!this.areSeriesDataEmpty(seriesData)) {
        this.renderChart('metodo-sujecion', 'Método Sin Picas', seriesData, fechas);
      } else {
        console.log('Método Sin Picas: No hay datos para mostrar.');
      }
    });
  }


  // Verificar si todas las series de datos están vacías
  private areSeriesDataEmpty(seriesData: (number | null)[][]): boolean {
    return seriesData.every(serie => serie.every(value => value === null || isNaN(value)));
  }
  // Método para renderizar gráficos
  private renderChart(chartId: string, title: string, seriesData: (number | null)[][], fechas: string[]) {
    const chartElement = am4core.create(chartId, am4charts.XYChart);
    chartElement.paddingRight = 20;

    const chartTitle = chartElement.titles.create();
    chartTitle.text = title;
    chartTitle.fontSize = 25;
    chartTitle.marginBottom = 20;
    chartTitle.align = "center";

    chartElement.data = fechas.map((fecha, index) => {
      let data: { [key: string]: any } = { fecha: fecha };

      seriesData.forEach((serie, i) => {
        const value = serie[index];
        if (value !== null && !isNaN(value)) {
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
    valueAxis.strictMinMax = false;
    valueAxis.min = 0;

    const range = valueAxis.axisRanges.create();
    range.value = 25;
    range.grid.stroke = am4core.color("red");
    range.grid.strokeWidth = 2;
    range.grid.strokeOpacity = 1;

    const colorPalette = [
      am4core.color("rgb(201, 201, 52)"),
      am4core.color("rgb(0, 0, 49)"),
      am4core.color("rgb(69, 167, 167)"),
      am4core.color("rgb(189, 118, 31)"),
    ];

    seriesData.forEach((serie, index) => {
      const hasData = serie.some(value => value !== null && !isNaN(value));
      if (!hasData) return;

      const series = chartElement.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = `pat${index + 1}`;
      series.dataFields.categoryX = "fecha";
      series.name = `PAT${index + 1}`;
      series.strokeWidth = 2;
      series.minBulletDistance = 10;

      const color = colorPalette[index % colorPalette.length];
      series.stroke = color;

      // Verificar tooltip antes de asignar
      if (series.tooltip) {
        series.tooltip.getFillFromObject = false;
        series.tooltip.background.fill = color;
        series.tooltip.label.fill = am4core.color("#fff");
        series.tooltipText = "{name}: [bold]{valueY}[/]";
      }

      const bullet = series.bullets.push(new am4charts.CircleBullet());
      bullet.circle.radius = 6;
      bullet.circle.strokeWidth = 2;
      bullet.circle.fill = color;


      const label = bullet.createChild(am4core.Label);
      label.text = "{valueY}";
      label.verticalCenter = "bottom";
      label.dy = -10;

      series.adapter.add("dy", (dy = 0, target) => {
        const index = target.dataItem?.index;
        const prevValue = index > 0 ? serie[index - 1] : null;
        if (prevValue !== null && Math.abs(prevValue - serie[index]!) < 0.5) {
          return dy + 10;
        }
        return dy;
      });
    });

    chartElement.cursor = new am4charts.XYCursor();
    chartElement.legend = new am4charts.Legend();
    chartElement.legend.itemContainers.template.dy = 5;
    chartElement.legend.markers.template.width = 18;
    chartElement.legend.markers.template.height = 18;

    // Usar adapter para los colores en la leyenda
    chartElement.legend.markers.template.adapter.add("fill", (fill, target) => {
      const dataContext = target.dataItem?.dataContext;
      const seriesIndex = dataContext && typeof dataContext === "object" && "index" in dataContext
        ? (dataContext as { index: number }).index
        : 0;
      return colorPalette[seriesIndex % colorPalette.length];
    });


    chartElement.exporting.menu = new am4core.ExportMenu();
  }




}






