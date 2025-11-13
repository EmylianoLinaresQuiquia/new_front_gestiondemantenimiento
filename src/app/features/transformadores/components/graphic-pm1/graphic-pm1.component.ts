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

    this.chart_valor_real = am4core.create("chart_valor_real", am4charts.XYChart);
    this.chart_valor_real.logo.disabled = true;

    let dateFormatter = new am4core.DateFormatter();

    // -----------------------------
    // 1) AGREGAR LOS SUBTÍTULOS
    // -----------------------------
    const st = (id: string, html: string) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    };

    st("chart-subtitles-top", `
      <span>(A)</span>
      <span>(MW)</span>
      <span>(kgf/CM²)</span>
      <span>(°C)</span>
      <span>(°C)</span>
    `);

    st("chart-subtitles-bottom", `
      <span>(A)</span>
      <span>(MW)</span>
      <span>(kgf/CM²)</span>
      <span>(°C)</span>
      <span>(°C)</span>
    `);

    // ------------------------------------------------------------------
    // 2) AGRUPAR VALORES POR FECHA PARA TOOLTIP COMPLETO
    // ------------------------------------------------------------------
    const tooltipGroup: Record<
      string,
      {
        manovacuometro: string[];
        temperatura_devanado: string[];
        temperatura_aceite: string[];
      }
    > = {};

    for (const item of data || []) {
      const dateKey = item.fecha;

      if (!tooltipGroup[dateKey]) {
        tooltipGroup[dateKey] = {
          manovacuometro: [],
          temperatura_devanado: [],
          temperatura_aceite: []
        };
      }

      const mv =
        item.manovacuometro_valor ??
        item.manovacuometro ??
        null;

      const td =
        item.temperatura_devanado_valor ??
        item.temperatura_devanado ??
        null;

      const ta =
        item.temperatura_aceite_valor ??
        item.temperatura_aceite ??
        null;

      // push si existen
      if (mv && !isNaN(parseFloat(mv))) {
        tooltipGroup[dateKey].manovacuometro.push(parseFloat(mv).toString());
      }

      if (td && !isNaN(parseFloat(td))) {
        tooltipGroup[dateKey].temperatura_devanado.push(parseFloat(td).toString());
      }

      if (ta && !isNaN(parseFloat(ta))) {
        tooltipGroup[dateKey].temperatura_aceite.push(parseFloat(ta).toString());
      }
    }

    // ------------------------------------------------------------------
    // 3) PROCESAR ITEMS Y USAR LISTAS DEL TOOLTIP AGRUPADO
    // ------------------------------------------------------------------
    this.chart_valor_real.data = data.map(item => {
      const key = item.fecha;

      return {
        date: item.fecha,
        corriente_actual: parseFloat(item.corriente_actual) || null,
        potencia_actual: parseFloat(item.potencia_actual) || null,

        manovacuometro: item.manovacuometro_valor ? parseFloat(item.manovacuometro_valor) : null,
        manovacuometro_list: tooltipGroup[key]?.manovacuometro?.join(", ") || "",

        temperatura_devanado: item.temperatura_devanado_valor ? parseFloat(item.temperatura_devanado_valor) : null,
        temperatura_devanado_list: tooltipGroup[key]?.temperatura_devanado?.join(", ") || "",

        temperatura_aceite: item.temperatura_aceite_valor ? parseFloat(item.temperatura_aceite_valor) : null,
        temperatura_aceite_list: tooltipGroup[key]?.temperatura_aceite?.join(", ") || ""
      };
    });

    // ------------------------------------------------------------------
    // 4) CONFIGURAR EJES
    // ------------------------------------------------------------------
    let categoryAxis = this.chart_valor_real.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "date";
    categoryAxis.renderer.minGridDistance = 200;
    categoryAxis.renderer.grid.template.location = 0.5;

    // ------------------------------------------------------------------
    // 5) CREAR SERIES Y TOOLTIP PERSONALIZADO
    // ------------------------------------------------------------------
    const createAxisAndSeries = (
  field: string,
  name: string,
  opposite: boolean,
  color: string,
  unit: string,
  listField?: string
) => {
  // Protección TypeScript
  if (!this.chart_valor_real) {
    console.error("chart_valor_real no inicializado");
    return;
  }

  // --- eje Y ---
  const yAxes = this.chart_valor_real.yAxes!;
  const valueAxis = yAxes.push(new am4charts.ValueAxis());

  const main = yAxes.getIndex(0) as am4charts.ValueAxis | undefined;

  if (yAxes.indexOf(valueAxis) !== 0 && main) {
    valueAxis.syncWithAxis = main;
  }

  valueAxis.renderer.opposite = opposite;
  valueAxis.renderer.grid.template.disabled = true;

  // --- serie ---
  const seriesList = this.chart_valor_real.series!;
  const series = seriesList.push(new am4charts.LineSeries());

  series.dataFields.valueY = field;
  series.dataFields.categoryX = "date";
  series.stroke = am4core.color(color);
  series.name = name;
  series.tensionX = 0.8;
  series.yAxis = valueAxis;

  // Tooltip con lista agrupada
  series.tooltipHTML = `
    <div style="font-size: 12px;">
      <b>${name}</b><br>
      Valores: {${listField || field}}${unit}
    </div>
  `;

  const bullet = series.bullets.push(new am4charts.CircleBullet());
  bullet.circle.fill = am4core.color(color);
  bullet.circle.stroke = am4core.color(color);
};


    // Series
    createAxisAndSeries("temperatura_devanado", "Temperatura Devanado", true, "#67B7DC", "", "temperatura_devanado_list");
    createAxisAndSeries("temperatura_aceite", "Temperatura Aceite", true, "#EDB2C3", "", "temperatura_aceite_list");
    createAxisAndSeries("manovacuometro", "Manovacuómetro", true, "#B3DBEE", "", "manovacuometro_list");

    createAxisAndSeries("corriente_actual", "Corriente Actual", false, "#C767DC", "");
    createAxisAndSeries("potencia_actual", "Potencia Actual", false, "#808080", "");

    this.chart_valor_real.legend = new am4charts.Legend();
    this.chart_valor_real.legend.position = "bottom";

    this.chart_valor_real.cursor = new am4charts.XYCursor();
    this.chart_valor_real.cursor.xAxis = categoryAxis;

    this.chart_valor_real.exporting.menu = new am4core.ExportMenu();
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
tendencia_testigo(data: any[]): void {
  this.zone.runOutsideAngular(() => {
    if (this.chart_valor_testigo) {
      this.chart_valor_testigo.dispose();
    }

    this.chart_valor_testigo = am4core.create("chart_valor_testigo", am4charts.XYChart);
    this.chart_valor_testigo.logo.disabled = true;

    let dateFormatter = new am4core.DateFormatter();

    // subtítulos (omito por brevedad, conserva tu código existente)
    const chartContainer = document.getElementById("chart-container-testigo");

    if (chartContainer) {
      const subtitleTopContainer = document.getElementById("chart-subtitles-top-testigo");
      if (subtitleTopContainer)
        subtitleTopContainer.innerHTML = `<span>(kgf/CM²)</span><span>(°C)</span><span>(°C)</span>`;

      const subtitleBottomContainer = document.getElementById("chart-subtitles-bottom-testigo");
      if (subtitleBottomContainer)
        subtitleBottomContainer.innerHTML = `<span>(kgf/CM²)</span><span>(°C)</span><span>(°C)</span>`;
    }

    // helper: normalizar fecha a key dd-MM-yyyy
    const formatKey = (fecha: string): string => {
      if (!fecha) return '';
      try {
        if (fecha.includes('/')) {
          const dt = dateFormatter.parse(fecha, "dd/MM/yyyy");
          return dateFormatter.format(dt, "dd-MM-yyyy");
        }
        if (fecha.includes('-')) {
          const parts = fecha.split('-');
          if (parts[0].length === 4)
            return `${parts[2].padStart(2, '0')}-${parts[1].padStart(2, '0')}-${parts[0]}`; // yyyy-mm-dd -> dd-mm-yyyy
          return fecha;
        }
        return fecha;
      } catch {
        return fecha;
      }
    };
 const processed: any[] = [];

// --- MAP GENERAL POR FECHA PARA AGRUPAR VALORES DEL TOOLTIP ---
const tooltipGroup: Record<
  string,
  {
    manovacuometro: string[];
    temperatura_devanado: string[];
    temperatura_aceite: string[];
  }
> = {};

// --- 1) RECORRER DATA Y AGRUPAR ---
for (const item of data || []) {
  const dateKey = formatKey(item.fecha || item.date || '');

  // Crear estructura si no existe
  if (!tooltipGroup[dateKey]) {
    tooltipGroup[dateKey] = {
      manovacuometro: [],
      temperatura_devanado: [],
      temperatura_aceite: []
    };
  }

  // Normalizar valores (string → float → string)
  const mv =
    item.manovacuometro_valor ??
    item.manovacuometro ??
    null;

  const td =
    item.temperatura_devanado_valor ??
    item.temperatura_devanado ??
    null;

  const ta =
    item.temperatura_aceite_valor ??
    item.temperatura_aceite ??
    null;

  // --- Guardar en grupos (si existe y es número) ---
  if (mv !== null && !isNaN(parseFloat(mv))) {
    tooltipGroup[dateKey].manovacuometro.push(parseFloat(mv).toString());
  }

  if (td !== null && !isNaN(parseFloat(td))) {
    tooltipGroup[dateKey].temperatura_devanado.push(parseFloat(td).toString());
  }

  if (ta !== null && !isNaN(parseFloat(ta))) {
    tooltipGroup[dateKey].temperatura_aceite.push(parseFloat(ta).toString());
  }

  // --- Insertar una FILA en processed por cada item (si deseas un punto por valor) ---
  processed.push({
    date: dateKey,
    manovacuometro: mv !== null ? parseFloat(mv) : null,
    temperatura_devanado: td !== null ? parseFloat(td) : null,
    temperatura_aceite: ta !== null ? parseFloat(ta) : null
  });
}

// --- 2) AGREGAR LISTAS DE TOOLTIP A CADA FILA YA CREADA ---
processed.forEach(row => {
  const group = tooltipGroup[row.date] || {};

  row.manovacuometro_list =
    group.manovacuometro?.join(", ") || "";

  row.temperatura_devanado_list =
    group.temperatura_devanado?.join(", ") || "";

  row.temperatura_aceite_list =
    group.temperatura_aceite?.join(", ") || "";
});

    // Convertir a array con campos *_list y primer valor (para dibujar)
   

    this.chart_valor_testigo.data = processed;

    // Eje X como categoría (fecha)
    let categoryAxis = this.chart_valor_testigo.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "date";
    categoryAxis.renderer.minGridDistance = 70;
    categoryAxis.renderer.grid.template.location = 0.5;

    // Crear series reutilizable: usa *_list en tooltip
    const createAxisAndSeries = (
      field: string,
      name: string,
      opposite: boolean,
      color: string,
      unit: string,
      listField?: string
    ) => {
      const valueAxis = this.chart_valor_testigo.yAxes.push(
        new am4charts.ValueAxis<am4charts.AxisRendererY>()
      );

      if (this.chart_valor_testigo.yAxes.indexOf(valueAxis) !== 0) {
        const mainAxis = this.chart_valor_testigo.yAxes.getIndex(0) as
          | am4charts.ValueAxis<am4charts.AxisRendererY>
          | undefined;

        if (mainAxis) valueAxis.syncWithAxis = mainAxis;
      }

      valueAxis.renderer.opposite = opposite;
      valueAxis.renderer.grid.template.stroke = am4core.color(color);
      valueAxis.renderer.grid.template.disabled = true;

      const series = this.chart_valor_testigo.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = field;
      series.dataFields.categoryX = "date";
      series.stroke = am4core.color(color);
      series.name = name;

      // usar campo listField para tooltip si se proporciona, sino valueY
      if (listField)
        series.tooltipText = `{name}: [bold]{${listField}}${unit}[/]`;
      else
        series.tooltipText = `{name}: [bold]{valueY}${unit}[/]`;

      series.tensionX = 0.8;
      series.yAxis = valueAxis;

      const bullet = series.bullets.push(new am4charts.CircleBullet());
      bullet.circle.stroke = am4core.color(color);
      bullet.circle.fill = am4core.color(color);

      valueAxis.renderer.line.strokeOpacity = 1;
      valueAxis.renderer.line.strokeWidth = 2;
      valueAxis.renderer.line.stroke = am4core.color(color);

      valueAxis.renderer.labels.template.adapter.add("text", (value: string | undefined) =>
        value ? value + unit : ""
      );
    };

    // Crear series usando los campos *_list para tooltip
    createAxisAndSeries("manovacuometro", "Manovacuómetro", false, "#B3DBEE", "", "manovacuometro_list");
    createAxisAndSeries("temperatura_devanado", "Temperatura Devanado", true, "#67B7DC", "", "temperatura_devanado_list");
    createAxisAndSeries("temperatura_aceite", "Temperatura de Aceite", true, "#EDB2C3", "", "temperatura_aceite_list");

    this.chart_valor_testigo.legend = new am4charts.Legend();
    this.chart_valor_testigo.legend.position = "bottom";

    this.chart_valor_testigo.cursor = new am4charts.XYCursor();
    this.chart_valor_testigo.cursor.xAxis = categoryAxis;

    this.chart_valor_testigo.exporting.menu = new am4core.ExportMenu();
    this.chart_valor_testigo.exporting.menu.items = [
      {
        label: "...",
        menu: [
          { type: "png", label: "PNG Image" },
          { type: "jpg", label: "JPG Image" },
          { type: "pdf", label: "PDF Image" },
          { type: "print", label: "Print" }
        ]
      }
    ];
  });
}

  //CREACION DEL GRAFICO TENDENDIA TESTIGO
  // ...existing code...


// ...existing code...


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

