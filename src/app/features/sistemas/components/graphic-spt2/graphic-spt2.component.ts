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
        const seriesData: number[][] = [];

        data.forEach((res: any, index: number) => {
          if (res.ohm_sujecion) {
              const valores = res.ohm_sujecion
                  .split(',')
                  .map((valor: string) => parseFloat(valor.trim()));
              valores.forEach((valor: number, serieIndex: number) => {
                  if (!seriesData[serieIndex]) {
                      seriesData[serieIndex] = Array(data.length).fill(null);
                  }
                  seriesData[serieIndex][index] = valor;
              });
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

    // Título del gráfico
    const chartTitle = chartElement.titles.create();
    chartTitle.text = title;
    chartTitle.fontSize = 25;
    chartTitle.marginBottom = 20;
    chartTitle.align = "center";

    // Preparar los datos
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

    // Configurar eje X
    const categoryAxis = chartElement.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "fecha";
    categoryAxis.title.text = "Fecha";

    // Configurar eje Y
    const valueAxis = chartElement.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Resistencia (Ω)";
    valueAxis.min = 0;

    // Línea roja en el eje Y (Target)
    const range = valueAxis.axisRanges.create();
    range.value = 25;
    range.grid.stroke = am4core.color("red");
    range.grid.strokeWidth = 2;
    range.grid.strokeOpacity = 1;

    // Paleta de colores para las series
    const patColors: { [key: string]: string } = {
        'PAT1': 'rgb(201, 201, 52)',
        'PAT2': 'rgb(0, 0, 49)',
        'PAT3': 'rgb(69, 167, 167)',
        'PAT4': 'rgb(189, 118, 31)'
    };

    // Crear las series
    seriesData.forEach((serie, index) => {
        const hasData = serie.some(value => value !== null && !isNaN(value));
        if (!hasData) return;

        const series = chartElement.series.push(new am4charts.LineSeries());
        const seriesName = `PAT${index + 1}`;
        series.dataFields.valueY = seriesName.toLowerCase();
        series.dataFields.categoryX = "fecha";
        series.name = seriesName;
        series.strokeWidth = 3;

        const color = am4core.color(patColors[seriesName]);
        series.stroke = color;

        // Marcadores (círculos) en las líneas
        const bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.fill = color;
        bullet.circle.stroke = am4core.color("#fff");
        bullet.circle.strokeWidth = 2;

        // Etiquetas en los puntos de datos
        const labelBullet = series.bullets.push(new am4charts.LabelBullet());
        labelBullet.label.text = "{valueY}";
        labelBullet.label.dy = -10;
        labelBullet.label.fontSize = 11;

        // Tooltip
        series.tooltipText = `${seriesName}: {valueY}`;
        if (series.tooltip) {
            series.tooltip.background.fill = color;
            series.tooltip.label.fill = am4core.color("#fff");
        }
    });

    // Cursor del gráfico
    chartElement.cursor = new am4charts.XYCursor();

    // Leyenda
    const legend = chartElement.legend = new am4charts.Legend();
    legend.itemContainers.template.dy = 5;
    legend.markers.template.width = 50;
    legend.markers.template.height = 10;

    // Personalizar los marcadores de la leyenda con el formato "-o-"
    legend.markers.template.children.clear();
    const markerTemplate = legend.markers.template.createChild(am4core.Container);
    markerTemplate.layout = "absolute";

    const line1 = markerTemplate.createChild(am4core.Line);
    line1.x1 = 0;
    line1.x2 = 20;
    line1.strokeWidth = 2;

    const circle = markerTemplate.createChild(am4core.Circle);
    circle.radius = 4;
    circle.x = 25;
    circle.strokeWidth = 2;

    const line2 = markerTemplate.createChild(am4core.Line);
    line2.x1 = 30;
    line2.x2 = 50;
    line2.strokeWidth = 2;

    legend.markers.template.adapter.add("fill", (fill, target) => {
        const series = target.dataItem?.dataContext as am4charts.LineSeries;
        if (series?.stroke) {
            const color = series.stroke as am4core.Color;
            line1.stroke = color;
            circle.fill = color;
            line2.stroke = color;
            return color;
        }
        return am4core.color("#000");
    });

    // Agregar "TARGET (25Ω)" a la leyenda
    legend.data = legend.data || [];
    legend.data.push({
        name: "TARGET (25Ω)",
        fill: am4core.color("red"),
    });

    // Crear un marcador personalizado para la entrada "TARGET (25Ω)"
    legend.markers.template.children.clear(); // Limpiar cualquier marcador previo
    const targetMarkerTemplate = legend.markers.template.createChild(am4core.Container);
    targetMarkerTemplate.layout = "absolute";

    const targetLine = targetMarkerTemplate.createChild(am4core.Line);
    targetLine.x1 = 0;
    targetLine.x2 = 50;
    targetLine.stroke = am4core.color("red");
    targetLine.strokeWidth = 2;
    targetLine.dy = 5; // Alinear la línea verticalmente

    const targetCircle = targetMarkerTemplate.createChild(am4core.Circle);
    targetCircle.radius = 4;
    targetCircle.x = 25;
    targetCircle.stroke = am4core.color("red");
    targetCircle.fill = am4core.color("red"); // Asegurar que el punto sea rojo
    targetCircle.strokeWidth = 2;
    targetCircle.dy = 5; // Alinear el círculo verticalmente

    // Exportación
    chartElement.exporting.menu = new am4core.ExportMenu();
}










}






