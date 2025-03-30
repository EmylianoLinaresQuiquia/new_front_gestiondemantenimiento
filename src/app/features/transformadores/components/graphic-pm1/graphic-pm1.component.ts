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
  //private chart_valor_real: am5xy.XYChart | null = null;

  private chart_valor_real: am4charts.XYChart | null = null;

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

  //CREACION DEL GRAFICO TENDENDIA POTENCIA
  tendencia_real(data: any[]): void {
    this.zone.runOutsideAngular(() => {
        if (this.chart_valor_real) {
            this.chart_valor_real.dispose();
        }

        // Crear el gráfico
        this.chart_valor_real = am4core.create("chart_valor_real", am4charts.XYChart);
        console.log("Chart created");

        let dateFormatter = new am4core.DateFormatter();
        this.chart_valor_real.logo.disabled = true;  // Desactivar el logo en el gráfico

        // Crear subtítulos en la parte superior
        const chartContainer = document.getElementById("chart-container");
        if (chartContainer) {
            const subtitleTopContainer = document.getElementById("chart-subtitles-top");
            if (subtitleTopContainer) {
                subtitleTopContainer.innerHTML = `
                    <span>(A)</span>
                    <span>(MW)</span>
                    <span>(kgf/CM²)</span>
                    <span>(°C)</span>
                    <span>(°C)</span>
                `;
                console.log("Subtítulos superiores agregados");
            }

            // Crear subtítulos en la parte inferior
            const subtitleBottomContainer = document.getElementById("chart-subtitles-bottom");
            if (subtitleBottomContainer) {
                subtitleBottomContainer.innerHTML = `
                    <span>(A)</span>
                    <span>(MW)</span>
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

        // Procesar los datos y agregar mensajes de depuración
        this.chart_valor_real.data = data.map(item => {
            const valores: number[] = item.valores_ingresados ? item.valores_ingresados.split(',').map((v: string) => parseInt(v.trim(), 10)) : [];
            const date = item.fecha.includes('/')
                ? dateFormatter.parse(item.fecha, "dd/MM/yyyy")
                : new Date(item.fecha);

            const processedItem = {
                date: item.fecha,  // Fecha como categoría
                corriente_actual: parseFloat(item.corriente_actual) || null,
                potencia_actual: parseFloat(item.potencia_actual) || null,
                manovacuometro: item.manovacuometro_valores ? parseFloat(item.manovacuometro_valores) : null,
                temperatura_devanado: item.temperatura_devanado_valores ? parseFloat(item.temperatura_devanado_valores) : null,
                temperatura_aceite: item.temperatura_aceite_valores ? parseFloat(item.temperatura_aceite_valores) : null,
            };

            console.log("Processed Item: ", processedItem);

            return processedItem;
        });

        let categoryAxis = this.chart_valor_real.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "date";
        categoryAxis.renderer.minGridDistance = 200;  // Aumentar la distancia mínima de la cuadrícula
        categoryAxis.renderer.grid.template.location = 0.5;

        let createAxisAndSeries = (
          field: string,
          name: string,
          opposite: boolean,
          color: string,
          unit: string
      ) => {
          if (!this.chart_valor_real) {
              console.error("chart_valor_real no está inicializado");
              return;
          }

          let valueAxis = this.chart_valor_real.yAxes.push(
              new am4charts.ValueAxis<am4charts.AxisRendererY>()
          );

          if (this.chart_valor_real.yAxes.indexOf(valueAxis) !== 0) {
              const mainAxis = this.chart_valor_real.yAxes.getIndex(0) as
                  | am4charts.ValueAxis<am4charts.AxisRendererY>
                  | undefined;

              if (mainAxis) {
                  valueAxis.syncWithAxis = mainAxis;
              } else {
                  console.warn("No se encontró el eje principal para sincronizar.");
              }
          }

          valueAxis.renderer.opposite = opposite;
          valueAxis.renderer.grid.template.stroke = am4core.color(color);
          valueAxis.renderer.grid.template.disabled = true; // Deshabilitar la cuadrícula del eje Y

          // Verifica que 'series' exista antes de usarla
          if (this.chart_valor_real.series) {
              let series = this.chart_valor_real.series.push(new am4charts.LineSeries());
            series.dataFields.valueY = field;
            series.dataFields.categoryX = "date";
            series.stroke = am4core.color(color);
            series.name = name;
            series.tooltipText = `${name}: [bold]{valueY}${unit}[/]`;
            series.tensionX = 0.8;
            series.yAxis = valueAxis;  // Asociar la serie con el eje Y correspondiente

            let bullet = series.bullets.push(new am4charts.CircleBullet());
            bullet.circle.stroke = am4core.color(color);
            bullet.circle.fill = am4core.color(color);

            valueAxis.renderer.line.strokeOpacity = 1;
            valueAxis.renderer.line.strokeWidth = 2;
            valueAxis.renderer.line.stroke = am4core.color(color);

            // Agregar etiqueta de unidad al eje
            valueAxis.renderer.labels.template.adapter.add("text", function (value: string | undefined) {
                if (value) {
                    return value + unit;
                } else {
                    return ""; // O manejar el caso de 'undefined' de otra forma, según lo necesites
                }
            });

            console.log(`Created series for ${name} with field ${field} and color ${color}`);
        };
      }

        // Crear todas las series y agregar mensajes de depuración
        // Series en el lado izquierdo
        createAxisAndSeries("temperatura_devanado", "Temperatura Devanado", true, "#67B7DC", "");
        createAxisAndSeries("temperatura_aceite", "Temperatura de Aceite", true, "#EDB2C3", "");
        createAxisAndSeries("manovacuometro", "Manovacuómetro", true, "#B3DBEE", "");
        // Series en el lado derecho
        createAxisAndSeries("corriente_actual", "Corriente Actual", false, "#C767DC", "");
        createAxisAndSeries("potencia_actual", "Potencia Actual", false, "#808080", "");
        // Configurar leyenda y cursor
        this.chart_valor_real.legend = new am4charts.Legend();
        this.chart_valor_real.legend.position = "bottom";

        this.chart_valor_real.cursor = new am4charts.XYCursor();
        this.chart_valor_real.cursor.xAxis = categoryAxis;
        console.log("Cursor created");

        this.chart_valor_real.exporting.menu = new am4core.ExportMenu();
        this.chart_valor_real.exporting.menu.items = [
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
        console.log("Export menu created");
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
      createAxisAndSeries("manovacuometro", "Manovacuómetro", false, "#B3DBEE", "");
      createAxisAndSeries("temperatura_devanado", "Temperatura Devanado", true, "#67B7DC", "");
      createAxisAndSeries("temperatura_aceite", "Temperatura de Aceite", true, "#EDB2C3", "");

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

