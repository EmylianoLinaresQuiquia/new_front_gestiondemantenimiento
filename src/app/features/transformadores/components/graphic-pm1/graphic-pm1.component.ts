import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4plugins_forceDirected from "@amcharts/amcharts4/plugins/forceDirected";
import { ActivatedRoute } from '@angular/router';
import { PM1Service } from 'src/app/features/sistemas/services/pm1.service';
import { SharedModule } from 'src/app/shared/shared.module';
am4core.useTheme(am4themes_animated);
@Component({
  selector: 'app-graphic-pm1',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './graphic-pm1.component.html',
  styleUrl: './graphic-pm1.component.css'
})
export class GraphicPm1Component {
  private chartCorrientePotencia: am4charts.XYChart = null!;
private chartCorrientePotencia2: am4charts.XYChart = null!;

private chartTestigo: am4charts.XYChart = null!;
  datos: any[] = [];
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
    this.pm1Service.mostrarDashboardPM1Reales(subestacion, transformador)
      .subscribe(
        data => {
          console.log('Datos del dashboard:', data);
          this.datos = data;
          this.tendencia_potencia(data);
        },
        error => {
          console.error('Error al obtener los datos del dashboard:', error);
        }
      );

      this.pm1Service.mostrarDashboardPM1Testigos(subestacion, transformador)
      .subscribe(
        data => {
          console.log('Datos del dashboard:', data);
          this.datos = data;
          this.tendencia_testigo(data);

        },
        error => {
          console.error('Error al obtener los datos del dashboard:', error);
        }
      );
  }

  //CREACION DEL GRAFICO TENDENDIA POTENCIA
  tendencia_potencia(data: any[]): void {
    this.zone.runOutsideAngular(() => {
        if (this.chartCorrientePotencia) {
            this.chartCorrientePotencia.dispose();
        }

        // Crear el gráfico
        this.chartCorrientePotencia = am4core.create("chartCorrientePotenciaDiv", am4charts.XYChart);
        console.log("Chart created");

        let dateFormatter = new am4core.DateFormatter();
        this.chartCorrientePotencia.logo.disabled = true;  // Desactivar el logo en el gráfico

        // Procesar los datos y agregar mensajes de depuración
        this.chartCorrientePotencia.data = data.map(item => {
            const valores: number[] = item.valores_ingresados ? item.valores_ingresados.split(',').map((v: string) => parseInt(v.trim(), 10)) : [];
            const date = item.fecha.includes('/')
                ? dateFormatter.parse(item.fecha, "dd/MM/yyyy")
                : new Date(item.fecha);

            const processedItem = {
              date: item.fecha,  // Fecha como categoría
              corriente_actual: parseFloat(item.corriente_actual),
              potencia_actual: parseFloat(item.potencia_actual),
              manovacuometro: parseFloat(item.manovacuometro_valores),
              temperatura_devanado: this.temperaturaValores[0] || null,
              temperatura_aceite: this.temperaturaValores[1] || null
            };

            console.log("Processed Item: ", processedItem);

            return processedItem;
        });

        let categoryAxis = this.chartCorrientePotencia.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "date";
        categoryAxis.renderer.minGridDistance = 70;  // Aumentar la distancia mínima de la cuadrícula
        categoryAxis.renderer.grid.template.location = 0.5;

        let createAxisAndSeries = (field: string, name: string, opposite: boolean, color: string, unit: string) => {
            let valueAxis = this.chartCorrientePotencia.yAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererY>());
            if (this.chartCorrientePotencia.yAxes.indexOf(valueAxis) !== 0) {
                valueAxis.syncWithAxis = this.chartCorrientePotencia.yAxes.getIndex(0) as am4charts.ValueAxis<am4charts.AxisRendererY>;
            }
            valueAxis.renderer.opposite = opposite;
            valueAxis.renderer.grid.template.stroke = am4core.color(color);
            valueAxis.renderer.grid.template.disabled = true;  // Deshabilitar la cuadrícula del eje Y

            let series = this.chartCorrientePotencia.series.push(new am4charts.LineSeries());
            series.dataFields.valueY = field;
            series.dataFields.categoryX = "date";
            series.stroke = am4core.color(color);
            series.name = name;
            series.tooltipText = `{name}: [bold]{valueY}${unit}[/]`;
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

        // Crear todas las series y agregar mensajes de depuración
        createAxisAndSeries("corriente_actual", "Corriente Actual", false, "#C767DC", "A");
        createAxisAndSeries("potencia_actual", "Potencia Actual", false, "#808080", "MW");
        createAxisAndSeries("manovacuometro", "Manovacuómetro", false, "#B3DBEE", "kgf/CM²");
        createAxisAndSeries("temperatura_devanado", "Temperatura Devanado", true, "#67B7DC", "°C");
        createAxisAndSeries("temperatura_aceite", "Temperatura de Aceite", false, "#EDB2C3", "°C");

        // Función para agregar etiquetas estáticas encima del gráfico
        let addUnitLabel = (text: string, color: string, relativeX: number, relativeY: number) => {
            let label = this.chartCorrientePotencia.plotContainer.createChild(am4core.Label);
            label.text = text;
            label.fill = am4core.color(color); // Color de la etiqueta
            label.fontSize = 14; // Tamaño de la fuente
            label.fontWeight = "bold";
            label.align = "center";
            label.isMeasured = false; // Permite usar coordenadas personalizadas
            label.x = this.chartCorrientePotencia.plotContainer.pixelWidth * relativeX; // Posición horizontal
            label.y = this.chartCorrientePotencia.plotContainer.pixelHeight * relativeY; // Posición vertical
        };

        // Agregar etiquetas para cada serie
        addUnitLabel("Corriente Actual (A)", "#C767DC", 0.1, -0.05); // Púrpura
        addUnitLabel("Potencia Actual (MW)", "#808080", 0.3, -0.05); // Gris
        addUnitLabel("Manovacuómetro (kgf/CM²)", "#B3DBEE", 0.5, -0.05); // Azul claro
        addUnitLabel("Temperatura Devanado (°C)", "#67B7DC", 0.7, -0.05); // Azul
        addUnitLabel("Temperatura Aceite (°C)", "#EDB2C3", 0.9, -0.05); // Rosado

        this.chartCorrientePotencia.legend = new am4charts.Legend();
        this.chartCorrientePotencia.legend.position = "bottom";
        console.log("Legend created");

        this.chartCorrientePotencia.cursor = new am4charts.XYCursor();
        this.chartCorrientePotencia.cursor.xAxis = categoryAxis;
        console.log("Cursor created");

        this.chartCorrientePotencia.exporting.menu = new am4core.ExportMenu();
        this.chartCorrientePotencia.exporting.menu.items = [
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
  //CREACION DEL GRAFICO TENDENDIA TESTIGO
  tendencia_testigo(data: any[]): void {
    this.zone.runOutsideAngular(() => {
      if (this.chartTestigo) {
        this.chartTestigo.dispose(); // Limpiar gráfico previo si existe
      }

      // Crear el gráfico testigo
      this.chartTestigo = am4core.create("chartTestigoDiv", am4charts.XYChart);
      console.log("Gráfico testigo creado");

      let dateFormatter = new am4core.DateFormatter();
      this.chartTestigo.logo.disabled = true;  // Desactivar el logo en el gráfico testigo

      // Procesar los datos
      this.chartTestigo.data = data.map(item => {
        const valores: number[] = item.valores_ingresados ? item.valores_ingresados.split(',').map((v: string) => parseInt(v.trim(), 10)) : [];
        const date = item.fecha.includes('/')
          ? dateFormatter.parse(item.fecha, "dd/MM/yyyy")
          : new Date(item.fecha);

        return {
        date: item.fecha,
        manovacuometro: parseFloat(item.manovacuometro_segundos),
        temperatura_devanado: this.temperaturaSegundos[0] || null,
        temperatura_aceite: this.temperaturaSegundos[1] || null
        };
      });

      // Crear eje X (fecha)
      let categoryAxis = this.chartTestigo.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "date";
      categoryAxis.renderer.minGridDistance = 70;
      categoryAxis.renderer.grid.template.location = 0.5;

      // Función para crear las series
      let createAxisAndSeries = (field: string, name: string, opposite: boolean, color: string, unit: string) => {
        let valueAxis = this.chartTestigo.yAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererY>());
        if (this.chartTestigo.yAxes.indexOf(valueAxis) !== 0) {
          valueAxis.syncWithAxis = this.chartTestigo.yAxes.getIndex(0) as am4charts.ValueAxis<am4charts.AxisRendererY>;
        }
        valueAxis.renderer.opposite = opposite;
        valueAxis.renderer.grid.template.stroke = am4core.color(color);
        valueAxis.renderer.grid.template.disabled = true;

        let series = this.chartTestigo.series.push(new am4charts.LineSeries());
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
      createAxisAndSeries("temperatura_aceite", "Temperatura de Aceite", false, "#EDB2C3", "°C");

      // Añadir leyenda, cursor y menú de exportación
      this.chartTestigo.legend = new am4charts.Legend();
      this.chartTestigo.legend.position = "bottom";
      this.chartTestigo.cursor = new am4charts.XYCursor();
      this.chartTestigo.cursor.xAxis = categoryAxis;

      this.chartTestigo.exporting.menu = new am4core.ExportMenu();
      this.chartTestigo.exporting.menu.items = [
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
      if (this.chartCorrientePotencia) {
        this.chartCorrientePotencia.dispose();
      }
      if (this.chartCorrientePotencia2) {
        this.chartCorrientePotencia2.dispose();
      }
    });

  }
}

