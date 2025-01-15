import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4plugins_forceDirected from "@amcharts/amcharts4/plugins/forceDirected";
import { ActivatedRoute } from '@angular/router';
import { PM1Service } from 'src/app/features/sistemas/services/pm1.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { forkJoin } from 'rxjs';


import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5plugins_exporting from "@amcharts/amcharts5/plugins/exporting";
am4core.useTheme(am4themes_animated);
@Component({
  selector: 'app-graphic-pm1',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './graphic-pm1.component.html',
  styleUrl: './graphic-pm1.component.css'
})
export class GraphicPm1Component {

private chart_valor_testigo: am4charts.XYChart = null!;

private root!: am5.Root; // Root instance for the chart
  private chart_valor_real: am5xy.XYChart | null = null;

datosReales: any[] = [];
datosTestigos: any[] = [];
  temperaturaValores: Array<number | null> = [null, null];
temperaturaSegundos: Array<number | null> = [null, null];

  constructor(
    private zone: NgZone,
    private route: ActivatedRoute,
    private pm1Service: PM1Service
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const subestacion = params['subestacion'] || null;
      const transformador = params['transformador'] || null;
      if (subestacion && transformador) {
        this.getDashboardData(subestacion, transformador);
      }
    });
  }

  getDashboardData(subestacion: string, transformador: string): void {
    forkJoin({
      reales: this.pm1Service.mostrarDashboardPM1Reales(subestacion, transformador),
      testigos: this.pm1Service.mostrarDashboardPM1Testigos(subestacion, transformador),
    }).subscribe({
      next: ({ reales, testigos }) => {
        console.log('Datos Reales:', reales);
        console.log('Datos Testigos:', testigos);

        this.datosReales = reales || [];
        this.datosTestigos = testigos || [];

        this.procesarDatos();
      },
      error: err => {
        console.error('Error al obtener datos del dashboard:', err);
      },
    });
  }

  procesarDatos(): void {
    if (this.datosReales.length > 0) {
      this.tendencia_real(this.datosReales);
    }

    if (this.datosTestigos.length > 0) {
      this.tendencia_testigo(this.datosTestigos);
    }
  }

  //CREACION DEL GRAFICO TENDENDIA POTENCIA

  tendencia_real(data: any[]): void {
    this.zone.runOutsideAngular(() => {
      if (this.root) {
        this.root.dispose();
      }

      this.root = am5.Root.new('chart_valor_real');
      this.root.setThemes([am5themes_Animated.default.new(this.root)]);

      const chart = this.root.container.children.push(
        am5xy.XYChart.new(this.root, {
          panX: true,
          panY: true,
          wheelX: 'panX',
          wheelY: 'zoomX',
          pinchZoomX: true,
          layout: this.root.verticalLayout,
        })
      );

      chart.get('colors')!.set('step', 2);

      const mesesDelAño = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ];

      const parseFecha = (fechaStr: string): { mes: string, dia: string } => {
        const [dia, mes, _] = fechaStr.split('-');
        const mesNombre = mesesDelAño[parseInt(mes, 10) - 1];
        return { mes: mesNombre, dia };
      };

      const procesarDatosAgrupados = (data: any[]) => {
        const mesesMap: { [key: string]: string[] } = {};

        mesesDelAño.forEach((mes) => {
          mesesMap[mes] = [];
        });

        data.forEach((item) => {
          if (!item.fecha) return;

          const { mes, dia } = parseFecha(item.fecha);

          if (!mesesMap[mes].includes(dia)) {
            mesesMap[mes].push(dia);
          }
        });

        const datosOrganizados: any[] = [];
        mesesDelAño.forEach((mes) => {
          if (mesesMap[mes].length > 0) {
            datosOrganizados.push({
              date: `${mes} ${mesesMap[mes].join(' ')}`, // Formato: "Enero 07 08 14"
              corriente_actual: 0,
              potencia_actual: 0,
              manovacuometro: 0,
              temperatura_devanado: 0,
              temperatura_aceite: 0,
            });
          } else {
            datosOrganizados.push({
              date: mes,
              corriente_actual: 0,
              potencia_actual: 0,
              manovacuometro: 0,
              temperatura_devanado: 0,
              temperatura_aceite: 0,
            });
          }
        });

        return { datosOrganizados, mesesMap };
      };

      const { datosOrganizados, mesesMap } = procesarDatosAgrupados(data);

      data.forEach((item) => {
        const { mes, dia } = parseFecha(item.fecha);
        const fechaTexto = `${mes} ${mesesMap[mes].join(' ')}`;

        const target = datosOrganizados.find((d) => d.date === fechaTexto);
        if (target) {
          target.corriente_actual = parseFloat(item.corriente_actual) || 0;
          target.potencia_actual = parseFloat(item.potencia_actual) || 0;
          target.manovacuometro = parseFloat(item.manovacuometro_valores) || 0;
          target.temperatura_devanado = parseFloat(item.temperatura_devanado_valores) || 0;
          target.temperatura_aceite = parseFloat(item.temperatura_aceite_valores) || 0;
        }
      });

      const xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(this.root, {
          categoryField: 'date',
          renderer: am5xy.AxisRendererX.new(this.root, {
            minGridDistance: 30,
          }),
        })
      );

      xAxis.data.setAll(datosOrganizados);

      const yAxisLeft = chart.yAxes.push(
        am5xy.ValueAxis.new(this.root, {
          renderer: am5xy.AxisRendererY.new(this.root, {}),
          min: 0,
        })
      );

      const yAxisRight = chart.yAxes.push(
        am5xy.ValueAxis.new(this.root, {
          renderer: am5xy.AxisRendererY.new(this.root, { opposite: true }),
          min: 0,
        })
      );

      const createSeries = (
        field: string,
        name: string,
        yAxis: am5xy.ValueAxis<any>,
        color: string
      ) => {
        const series = chart.series.push(
          am5xy.LineSeries.new(this.root, {
            name,
            xAxis,
            yAxis,
            valueYField: field,
            categoryXField: 'date',
            stroke: am5.color(color),
            tooltip: am5.Tooltip.new(this.root, {
              labelText: '{name}: {valueY}',
            }),
          })
        );

        series.strokes.template.setAll({ strokeWidth: 2 });

        series.bullets.push(() =>
          am5.Bullet.new(this.root, {
            sprite: am5.Circle.new(this.root, {
              radius: 5,
              fill: am5.color(color),
              stroke: am5.color(0xffffff),
              strokeWidth: 2,
            }),
          })
        );

        // Agregar etiquetas sobre los puntos
        series.bullets.push(() =>
          am5.Bullet.new(this.root, {
            sprite: am5.Label.new(this.root, {
              text: '{valueY}',
              centerY: am5.p100,
              centerX: am5.p50,
              populateText: true,
              dy: -15, // Ajustar altura de la etiqueta
            }),
          })
        );

        series.data.setAll(datosOrganizados);
      };

      createSeries('corriente_actual', 'Corriente Actual', yAxisLeft, '#C767DC');
      createSeries('potencia_actual', 'Potencia Actual', yAxisLeft, '#808080');
      createSeries('manovacuometro', 'Manovacuómetro', yAxisRight, '#B3DBEE');
      createSeries('temperatura_devanado', 'Temperatura Devanado', yAxisRight, '#67B7DC');
      createSeries('temperatura_aceite', 'Temperatura Aceite', yAxisRight, '#EDB2C3');

      const legend = chart.children.push(am5.Legend.new(this.root, {}));
      legend.data.setAll(chart.series.values);

      chart.set('cursor', am5xy.XYCursor.new(this.root, {}));

      const exporting = am5plugins_exporting.Exporting.new(this.root, {});
    });
}








  /*
  // Crear un menú manualmente
const menuContainer = document.createElement("div");
menuContainer.className = "export-menu";

// Agregar opciones al menú
const options = [
  { label: "PNG Image", format: "png" },
  { label: "JPG Image", format: "jpg" },
  { label: "PDF Document", format: "pdf" },
  { label: "Print", action: () => window.print() }
];

options.forEach(option => {
  const button = document.createElement("button");
  button.innerText = option.label;
  button.onclick = () => {
    if (option.format) {
      exporting.download(option.format as any); // Tipo `any` para evitar errores de tipo
    } else if (option.action) {
      option.action();
    }
  };
  menuContainer.appendChild(button);
});


// Agregar el menú al DOM
const chartContainer = document.getElementById("chart-container");
if (chartContainer) {
  chartContainer.appendChild(menuContainer);
}
   */

  //CREACION DEL GRAFICO TENDENDIA TESTIGO
  tendencia_testigo(data: any[]): void {
    this.zone.runOutsideAngular(() => {
      if (this.chart_valor_testigo) {
        this.chart_valor_testigo.dispose(); // Limpiar gráfico previo si existe
      }

      // Crear el gráfico testigo
      this.chart_valor_testigo = am4core.create("chart_valor_testigo", am4charts.XYChart);
      console.log("Gráfico testigo creado");

      let dateFormatter = new am4core.DateFormatter();
      this.chart_valor_testigo.logo.disabled = true;  // Desactivar el logo en el gráfico testigo


      // Crear subtítulos en la parte superior
      const chartContainer = document.getElementById("chart-container-testigo");
      if (chartContainer) {
          const subtitleTopContainer = document.getElementById("chart-subtitles-top-testigo");
          if (subtitleTopContainer) {
              subtitleTopContainer.innerHTML = `

                  <span>(kgf/CM²)</span>
                  <span>(°C)</span>
                  <span>(°C)</span>
              `;
              console.log("Subtítulos superiores agregados");
          }

          // Crear subtítulos en la parte inferior
          const subtitleBottomContainer = document.getElementById("chart-subtitles-bottom-testigo");
          if (subtitleBottomContainer) {
              subtitleBottomContainer.innerHTML = `

                  <span>(kgf/CM²)</span>
                  <span>(°C)</span>
                  <span>(°C)</span>
              `;
              console.log("Subtítulos inferiores agregados");
          } else {
              console.error("No se encontró el contenedor de subtítulos inferiores");
          }
      } else {
          console.error("No se encontró el contenedor principal del gráfico");
      }

      // Procesar los datos
      this.chart_valor_testigo.data = data.map(item => {
        const valores: number[] = item.valores_ingresados ? item.valores_ingresados.split(',').map((v: string) => parseInt(v.trim(), 10)) : [];
        const date = item.fecha.includes('/')
        ? dateFormatter.parse(item.fecha, "dd/MM/yyyy")
        : new Date(item.fecha);

        const processedItem = {
          date: item.fecha,  // Fecha como categoría
          manovacuometro: item.manovacuometro ? parseFloat(item.manovacuometro) : null,
          temperatura_devanado: item.temperatura_devanado ? parseFloat(item.temperatura_devanado) : null,
          temperatura_aceite: item.temperatura_aceite ? parseFloat(item.temperatura_aceite) : null,
        };

    console.log("Processed Item: ", processedItem);

    return processedItem;
    });

      // Crear eje X (fecha)
      let categoryAxis = this.chart_valor_testigo.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "date";
      categoryAxis.renderer.minGridDistance = 70;
      categoryAxis.renderer.grid.template.location = 0.5;

      // Función para crear las series
      let createAxisAndSeries = (field: string, name: string, opposite: boolean, color: string, unit: string) => {
        let valueAxis = this.chart_valor_testigo.yAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererY>());
        if (this.chart_valor_testigo.yAxes.indexOf(valueAxis) !== 0) {
          valueAxis.syncWithAxis = this.chart_valor_testigo.yAxes.getIndex(0) as am4charts.ValueAxis<am4charts.AxisRendererY>;
        }
        valueAxis.renderer.opposite = opposite;
        valueAxis.renderer.grid.template.stroke = am4core.color(color);
        valueAxis.renderer.grid.template.disabled = true;

        let series = this.chart_valor_testigo.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = field;
        series.dataFields.categoryX = "date";
        series.stroke = am4core.color(color);
        series.name = name;
        series.tooltipText = `{name}: [bold]{valueY}${unit}[/]`;
        series.tensionX = 0.8;
        series.yAxis = valueAxis;

        let bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.stroke = am4core.color(color);
        bullet.circle.fill = am4core.color(color);

        valueAxis.renderer.line.strokeOpacity = 1;
        valueAxis.renderer.line.strokeWidth = 2;
        valueAxis.renderer.line.stroke = am4core.color(color);

        // Agregar etiqueta de unidad al eje
        valueAxis.renderer.labels.template.adapter.add("text", (value: string | undefined) => {
          return value ? value + unit : "";
        });

        console.log(`Serie creada para ${name} con campo ${field} y color ${color}`);
      };

      // Crear las series para el gráfico testigo
      createAxisAndSeries("manovacuometro", "Manovacuómetro", false, "#B3DBEE", "MVA");
      createAxisAndSeries("temperatura_devanado", "Temperatura Devanado", true, "#67B7DC", "°C");
      createAxisAndSeries("temperatura_aceite", "Temperatura de Aceite", true, "#EDB2C3", "°C");

      // Añadir leyenda, cursor y menú de exportación
      this.chart_valor_testigo.legend = new am4charts.Legend();
      this.chart_valor_testigo.legend.position = "bottom";
      this.chart_valor_testigo.cursor = new am4charts.XYCursor();
      this.chart_valor_testigo.cursor.xAxis = categoryAxis;

      this.chart_valor_testigo.exporting.menu = new am4core.ExportMenu();
      this.chart_valor_testigo.exporting.menu.items = [
        {
          "label": "...",
          "menu": [
            { "type": "png", "label": "PNG Image" },
            { "type": "jpg", "label": "JPG Image" },
            { "type": "pdf", "label": "PDF Image" },
            { "type": "print", "label": "Print" }
          ]
        }
      ];

      console.log("Export menu para gráfico testigo creado");
    });
  }


  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart_valor_real) {
        this.chart_valor_real.dispose();
      }
      if (this.chart_valor_testigo) {
        this.chart_valor_testigo.dispose();
      }
    });

  }
}

