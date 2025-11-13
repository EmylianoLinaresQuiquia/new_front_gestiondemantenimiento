import { Component,OnInit,ViewEncapsulation, ViewChild, ElementRef,AfterViewInit,TemplateRef } from '@angular/core';
import { Usuario } from 'src/app/features/sistemas/interface/usuario';
import { UsuarioService } from 'src/app/features/sistemas/services/usuario.service';
import { TransformadorPM1Service } from 'src/app/features/sistemas/services/transformador-pm1.service';
import { PM1Service } from 'src/app/features/sistemas/services/pm1.service';
import { ActivatedRoute } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AlertService } from 'src/app/features/sistemas/services/alert.service';
import { NotificacionService } from 'src/app/features/sistemas/services/notificacion.service';
import { Notificacion } from 'src/app/features/sistemas/interface/notificacion';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import  html2canvas from 'html2canvas';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { PM1 } from 'src/app/features/sistemas/interface/pm1';
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';


export interface Item {
  label: string; // Etiqueta del campo
  tipo: 'valores' | 'opciones'; // Tipo del campo
  valores?: number[]; // Para valores reales y testigos
  opciones?: string[]; // Lista de opciones disponibles
  valor?: string; // Valor seleccionado
}

export interface Equipo {
  seleccionados: string[];      // Lista de seleccionados
  valorReal?: number[];        // Lista de valores reales
  valorTestigo?: number[];     // Lista de valores testigo
}

export interface Formulario {
  items: Item[];
}

export interface Transformador {
  form1?: Formulario;
  form2?: Formulario;
  form3?: Formulario;
  form4?: Formulario;
  imagen?: string;
}
export interface SeguridadObservacionSPT {
  descripcion: string;
  estado: 'BUENO' | 'MALO' | 'NA'| string; 
  observacion: string;
}
export interface PatioObservacion {
  descripcion: string;
  estado: 'BUENO' | 'MALO' | 'NA';
  observacion: string;
}
export interface AvisoObservacion {
  recomendacion: string;
  estado: 'BUENO' | 'MALO';
  solicitud: string;
}

@Component({
  selector: 'app-pm1-inspection',
  standalone: true,
  imports: [SharedModule,NzModalModule,NgxExtendedPdfViewerModule],
  providers: [
    NzModalService, // Ensure the service is provided here
  ],
  templateUrl: './pm1-inspection.component.html',
  styleUrl: './pm1-inspection.component.css'
})
export class Pm1InspectionComponent implements OnInit,AfterViewInit{

   transformadorData: any;
  usuarios: Usuario[] = [];
  usuariosMap: Map<number, Usuario> = new Map();
  tecnico: Usuario[] = []; // Lista de técnicos (filtrada desde usuarios)
  supervisor: Usuario[] = [];
  correoSeleccionado = '';
  correoSeleccionado1 = '';
  rutaFirmaSeleccionada = '';
  fotocheckSeleccionado: number | null = null;
  fotocheckSeleccionado1: number | null = null;
   idusuario: number | null = null;
  idusuario2 :number | null = null;
   ubicacion: string = '';
   subestacion: string = '';
   transformador: string = '';
   id_transformadores:string = '';

   transformador1: any = {
    form1: { estadosGenerales: [], mediciones: [] },
    form2: { estadosGenerales: [], mediciones: [] },
    imagen: null,
  };

  transformador2: any = {
    form3: { estadosGenerales: [], mediciones: [] },
    form4: { estadosGenerales: [], mediciones: [] },
    imagen: null,
  };


  private annotations: any[] = [

  ];



  constructor(
    private transformadorService: TransformadorPM1Service,
    private usuarioService: UsuarioService,
    private alertservice:AlertService,
    private pm1Service: PM1Service,
    private route:ActivatedRoute,
    private NotificacionService :NotificacionService,
    private modal: NzModalService,
    private sanitizer: DomSanitizer,
    private messageService:NzMessageService,
      private notificationService:NzNotificationService,
  ) {

  }
  



ngAfterViewInit(): void {
  const setStyle = (el: HTMLElement, styles: Record<string, string>) =>
    Object.entries(styles).forEach(([prop, val]) =>
      el.style.setProperty(prop, val, 'important')
    );

  const styleSection = (el: HTMLElement) => {
    setStyle(el, {
      'background-color': '#00000000',
     'border': 'none',
      'opacity': '1',
      'mix-blend-mode': 'normal'
    });

    // 🔹 Elimina overlays visuales del visor PDF
    el.querySelectorAll('rect, .highlight, .widgetOverlay').forEach((n) =>
      setStyle(n as HTMLElement, { display: 'none', opacity: '0' })
    );

     
    // 🎯 Detecta el campo del formulario
    const input = el.querySelector('input, textarea') as HTMLInputElement | null;
    if (input) {
      if (input.type === 'checkbox' || input.type === 'radio') {
        // 💡 Caso checkbox / radio
        setStyle(input, {
          'background-color': 'transparent',
          'color': 'black',
          
          'cursor': 'pointer'
        });
      } else {
        // ✏️ Caso input o textarea de texto
        setStyle(input, {
          'background-color': '#00000000',
          'color': 'black',
         
         'font-size': '13px',
        });
      }
    }
   
  };
  const ensureGlobalStyle = () => {
  if (document.getElementById('pdf-global-style')) return;
  const style = document.createElement('style');
  style.id = 'pdf-global-style';
  style.textContent = `
    ngx-extended-pdf-viewer input,
    ngx-extended-pdf-viewer textarea,
    .textWidgetAnnotation input,
    .textWidgetAnnotation textarea,
    
    ngx-extended-pdf-viewer input:focus,
    ngx-extended-pdf-viewer textarea:focus,
    .textWidgetAnnotation input:focus,
    .textWidgetAnnotation textarea:focus,
    

    input:-webkit-autofill,
    textarea:-webkit-autofill {
      -webkit-box-shadow:0 0 0px 1000px transparent inset!important;
      box-shadow:0 0 0px 1000px transparent inset!important;
    }
    .pdf-placeholder-overlay {
      position:absolute;
      pointer-events:none;
      color:#777;
      font-size:12px;
      transition:opacity .12s ease;
      opacity:1;
    }
    .pdf-placeholder-overlay.hidden {
      opacity:0;
    }
  `;
  document.head.appendChild(style);
};

  const insertImages = () => {
    const container = document.querySelector('.page') as HTMLElement | null;
    if (!container) return;
    if (container.querySelector('.img-transformador')) return;

    const createImg = (src: string, top: string, left: string) => {
      const img = document.createElement('img');
      img.src = src;
      img.classList.add('img-transformador');
      Object.assign(img.style, {
        position: 'absolute',
        top,
        left,
        transform: 'translate(-50%, -50%)',
        width: '550px',
        height: 'auto',
        objectFit: 'contain',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.3)',
        zIndex: '50',
      });
      container.appendChild(img);
    };

    // Centrar imágenes
    if (this.transformador1?.imagen) createImg(this.transformador1.imagen, '35%', '50%');
    if (this.transformador2?.imagen) createImg(this.transformador2.imagen, '63%', '50%');
  };

  /** 🔥 Crea formularios flotantes dentro del PDF */
  const insertForms = () => {
    const container = document.querySelector('.page') as HTMLElement | null;
    if (!container) return;

    // Evitar duplicados
    if (container.querySelector('.pdf-form-section')) return;

    /**
     * 🔹 Crea una sección de formulario
     * @param items Lista de campos
     * @param top Posición vertical
     * @param left Posición horizontal
     * @param align Alineación vertical interna ('flex-start' | 'flex-end')
     */
    const createFormSection = (items: any[], top: string, left: string, align: 'flex-start' | 'flex-end') => {
      const form = document.createElement('div');
      form.classList.add('pdf-form-section');
      Object.assign(form.style, {
        position: 'absolute',
        top,
        left,
        transform: 'translate(-50%, -50%)',
        width: '270px',
        zIndex: '80',
        display: 'flex',
        flexDirection: 'column',
        alignItems: align, // 💥 aquí aplicamos la diferencia
      });

      items.forEach((item) => {
        const field = document.createElement('div');
        field.style.width = '100%';
        field.style.display = 'flex';
        field.style.flexDirection = 'column';
        field.style.alignItems = align; // 💥 y también dentro de cada campo

        const label = document.createElement('label');
        label.textContent = item.label;
        label.style.fontWeight = 'bold';
        label.style.marginBottom = '4px';
        field.appendChild(label);

        if (item.tipo === 'opciones' && item.opciones) {
          const select = document.createElement('select');
          select.style.padding = '4px';
          select.style.width = '50%';
          item.opciones.forEach((op: string) => {
            const opt = document.createElement('option');
            opt.value = op;
            opt.textContent = op;
            select.appendChild(opt);
          });
          select.value = item.valor || '';
          field.appendChild(select);
        }

        if (item.tipo === 'valores' && item.valores) {
          const box = document.createElement('div');
          box.style.display = 'flex';
          box.style.gap = '6px';
          const input1 = document.createElement('input');
          input1.placeholder = 'v. real';
          input1.value = item.valores[0] || '';
          input1.style.width = '70px';
          input1.style.border = '1px solid #aaa';
         
          const input2 = document.createElement('input');
          input2.placeholder = 'v. testigo';
          input2.value = item.valores[1] || '';
          input2.style.width = '70px';
          input2.style.border = '1px solid #aaa';
        
          box.appendChild(input1);
          box.appendChild(input2);

          // Etiquetas adicionales
          if (item.label.trim() === 'Manovacuómetro') {
            const span = document.createElement('span');
            span.textContent = 'kgf/cm²';
            span.style.fontSize = '12px';
            box.appendChild(span);
          } else if (['Termómetro de aceite', 'Termómetro de devanado'].includes(item.label.trim())) {
            const span = document.createElement('span');
            span.textContent = '°C';
            span.style.fontSize = '12px';
            box.appendChild(span);
          }

          field.appendChild(box);
        }

        form.appendChild(field);
      });

      container.appendChild(form);
    };

    // Posicionar formularios junto a tus imágenes con diferente alineación
    if (this.transformador1?.form1?.items)
      createFormSection(this.transformador1.form1.items, '34%', '13%', 'flex-start'); // 🟩 arriba
    if (this.transformador1?.form2?.items)
      createFormSection(this.transformador1.form2.items, '34%', '87%', 'flex-end'); // 🟦 abajo
    if (this.transformador2?.form3?.items)
      createFormSection(this.transformador2.form3.items, '60%', '13%', 'flex-start');
    if (this.transformador2?.form4?.items)
      createFormSection(this.transformador2.form4.items, '60%', '87%', 'flex-end');
  };
  const fotocheck_tecnico = () => {
  const campo = document.querySelector('.textWidgetAnnotation input[name="fotocheck_tecnico"]') as HTMLInputElement | null;
  if (!campo) return;

  const contenedor = campo.closest('.page');
  if (!contenedor) return;

  // Evita duplicados
  if (contenedor.querySelector('.correo-tecnico') || contenedor.querySelector('.firma-tecnico')) return;

  /** 🟩 Crear y posicionar CORREO */
  const correoSpan = document.createElement('span');
  correoSpan.classList.add('correo-tecnico');
  Object.assign(correoSpan.style, {
    position: 'absolute',
    top: '94.5%',   // ← ajusta según el lugar exacto en el PDF
    left: '12%',
    
    zIndex: '90'
  });
  contenedor.appendChild(correoSpan);

  /** 🟦 Crear y posicionar FIRMA */
  const firmaImg = document.createElement('img');
  firmaImg.classList.add('firma-tecnico');
  Object.assign(firmaImg.style, {
    position: 'absolute',
    top: '96.2%',   // ← ajusta según el lugar exacto en el PDF
    left: '23%',
    width: '80px',
    height: 'auto',
    display: 'none',
    zIndex: '90'
  });
  contenedor.appendChild(firmaImg);

  /** 🧠 Escuchar cambios del campo */
  campo.addEventListener('input', (ev) => {
    const raw = (ev.target as HTMLInputElement).value.trim();
    const valorNum = raw === '' ? null : Number(raw);
    const t = valorNum !== null && !isNaN(valorNum)
      ? this.tecnico.find((x) => x.fotocheck === valorNum)
      : undefined;

    if (t) {
      correoSpan.textContent = t.correo;
      firmaImg.src = t.firma;
      firmaImg.style.display = 'block';
      this.correoSeleccionado = t.correo;
      this.rutaFirmaSeleccionada = t.firma;

       /** 🔥 ASIGNAR ID USUARIO TÉCNICO */
      this.idusuario = t.idUsuario || null;
    } else {
      correoSpan.textContent = '';
      firmaImg.style.display = 'none';
      this.correoSeleccionado = '';
      this.rutaFirmaSeleccionada = '';
    }
  });
};
/** 🔹 Aplica estilos base a los campos del PDF */
const applyInlineStylesToField = (f: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) => {
  ['outline', 'box-shadow', '-webkit-box-shadow', 'background', 'appearance', '-webkit-appearance']
    .forEach(p => f.style.setProperty(p, '', ''));
  f.style.setProperty('background', 'transparent', 'important');
  f.style.setProperty('color', '#000', 'important');
  f.style.setProperty('font-size', '12px', 'important');
  f.style.setProperty('text-align', 'left', 'important');
};

/** 🔹 Crea overlay visual del placeholder */


/** 🔹 Crea placeholders y tipos de input según el nombre */
const reapplyPlaceholders = () => {
  ensureGlobalStyle();
  document.querySelectorAll<HTMLInputElement>('.textWidgetAnnotation input, ngx-extended-pdf-viewer input')
    .forEach(f => {
      applyInlineStylesToField(f);

      if (f.name === 'fecha') {
        f.type = 'date'; // 🗓️ convierte en selector de fecha
        
      } 
      else if (f.name === 'hora_inicio') {
        f.type = 'time'; // ⏰ convierte en selector de hora
        
      } 
      else if (f.name === 'hora_fin') {
        f.type = 'time';
        
      }
    });
};

/** 🔹 Inserta eventos personalizados sobre secciones del PDF */
const applyButtonEvents = () => {
  // --- BOTÓN 1 ---
  const boton1 = document.querySelector('section[data-annotation-id="678R"]');
  if (boton1 && !(boton1 as any)._clickAsignado) {
    boton1.addEventListener('click', () => this.VerPlano());
    (boton1 as any)._clickAsignado = true;
    console.log('✔️ Evento de click añadido correctamente (678R)');
  }

  // --- BOTÓN 2 ---
  const boton2 = document.querySelector('section[data-annotation-id="677R"]');
  if (boton2 && !(boton2 as any)._clickAsignado) {
    boton2.addEventListener('click', () => this.saveData());
    (boton2 as any)._clickAsignado = true;
    console.log('✔️ Evento de click añadido correctamente (677R)');
  }
};


const fotocheck_supervisor = () => { 
  const campo = document.querySelector('.textWidgetAnnotation input[name="fotocheck_supervisor"]') as HTMLInputElement | null;
  if (!campo) return;

  const contenedor = campo.closest('.page');
  if (!contenedor) return;

  // Evita duplicados
  if (contenedor.querySelector('.correo-supervisor')) return;

  /** 🟩 Crear y posicionar CORREO */
  const correoSpan = document.createElement('span');
  correoSpan.classList.add('correo-supervisor');
  Object.assign(correoSpan.style, {
    position: 'absolute',
    top: '94.5%',   // ← ajusta según el lugar exacto del correo en el PDF
    left: '58%',
    fontWeight: 'bold',
   
    zIndex: '90'
  });
  contenedor.appendChild(correoSpan);

  /** 🧠 Escuchar cambios del campo */
  campo.addEventListener('input', (ev) => {
    const raw = (ev.target as HTMLInputElement).value.trim();
    const valorNum = raw === '' ? null : Number(raw);
    const s = valorNum !== null && !isNaN(valorNum)
      ? this.supervisor.find((x) => x.fotocheck === valorNum)
      : undefined;

    if (s) {
      correoSpan.textContent = s.correo;
      this.correoSeleccionado1 = s.correo;
      this.idusuario2 = s.idUsuario || null;
    } else {
      correoSpan.textContent = '';
      this.correoSeleccionado1 = '';
    }
  });
};




  const applyAll = () => {
    const viewerContainer = document.getElementById('viewerContainer') || document.body;
    viewerContainer.querySelectorAll('.page, .pdfViewer').forEach((s) => styleSection(s as HTMLElement));
    document.querySelectorAll('.textWidgetAnnotation').forEach((s) => styleSection(s as HTMLElement));
    document
      .querySelectorAll('.annotationLayer svg, .annotationLayer rect, .annotationLayer .widgetOverlay ')
      .forEach((n) => setStyle(n as HTMLElement, { display: 'none', opacity: '0' }));
    document.querySelectorAll('.annotationLayer section').forEach((section) => {
    styleSection(section as HTMLElement);
   });

   const fillField = (name: string, value: string) => {
    const field = document.querySelector(
        `.textWidgetAnnotation input[name="${name}"], .textWidgetAnnotation textarea[name="${name}"]`
        ) as HTMLInputElement | HTMLTextAreaElement | null;
      if (field) {
      field.value = value;
      field.dispatchEvent(new Event('input', { bubbles: true }));
      }
    };

    fillField('transformador', this.transformador || '');
    fillField('subestacion', this.subestacion || '');
    fillField('ubicacion', this.ubicacion || '');

    insertImages();
    insertForms(); // 🧩 Inserta los formularios
    reapplyPlaceholders();
    
    fotocheck_tecnico();
    fotocheck_supervisor(); 
    applyButtonEvents(); 
  };
  

  applyAll();

 const observer = new MutationObserver(() => {
  observer.disconnect(); // 🔒 evita loops infinitos
  applyAll();
  setTimeout(() => observer.observe(target, config), 50); // 🔓 reanuda tras aplicar cambios
});

const target = document.querySelector('ngx-extended-pdf-viewer') ?? document.body;
const config = { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] };
observer.observe(target, config);

}





  async ngOnInit() {
    
    this.route.queryParams.subscribe(params => {
      this.subestacion = params['subestacion'] || '';
      this.transformador = params['transformador'] || '';
      this.id_transformadores = params['id_transformadores'] || '';
      this.ubicacion = params['ubicacion'] || '';

      if (params['transformadorData']) {
        this.transformadorData = JSON.parse(params['transformadorData']);
        console.log("Datos del transformador:", this.transformadorData);

        // Validar y asignar transformadores
        this.transformador1 = this.transformadorData?.form1 && this.transformadorData?.form2 ? {
          form1: this.normalizeForm(this.transformadorData.form1),
          form2: this.normalizeForm(this.transformadorData.form2),
          imagen: this.transformadorData.imagen?.[0] || null,
        } : null;

        this.transformador2 = this.transformadorData?.form3 && this.transformadorData?.form4 ? {
          form3: this.normalizeForm(this.transformadorData.form3),
          form4: this.normalizeForm(this.transformadorData.form4),
          imagen: this.transformadorData.imagen2?.[0] || null,
        } : null;
      }
    });

    this.usuarioService.getUsers().subscribe(
      (usuarios: Usuario[]) => {
        this.usuarios = usuarios;
        this.usuarios.forEach(usuario => {
          this.usuariosMap.set(usuario.fotocheck, usuario);
        });
        // Mantener una lista separada de técnicos para búsquedas rápidas por fotocheck
        this.tecnico = this.usuarios.filter(u => (u.cargo || '').toUpperCase() === 'TECNICO');
        this.supervisor = this.usuarios.filter(u => (u.cargo || '').toUpperCase() === 'SUPERVISOR');
      },
      error => {
        console.error('Error al obtener la lista de usuarios:', error);
      }
    );
    
  }


// Normalizar formularios para inicializar valores predeterminados
normalizeForm(form: any): any {
  if (!form || !form.items) return null;
  return {
    ...form,
    items: form.items.map((item: any) => ({
      ...item,
      tipo: item.valores ? 'valores' : 'opciones' // Identificar tipo automáticamente
    }))
  };
}

horaInicio: string = '--:--';
horaFin: string = '--:--';
ordenTrabajo: string = '';
fechaOrden: string = '';
potenciaActual: string = '';
corrienteActual: string = '';

seguridadObservaciones = [
  { descripcion: 'Completar los permisos de trabajo según la actividad adjuntados a la OT (IPERC - ATS - PETAR PETS)', estado: 'NA', observacion: '' },
  { descripcion: 'Inspección de herramientas y evitar exceso de carga (>25 kg)', estado: 'NA', observacion: '' },
  { descripcion: 'Usar implementos de seguridad personal de acuerdo al tipo de trabajo (EPP\'s)', estado: 'NA', observacion: '' },
  { descripcion: 'Realizar el aislamiento, bloqueo y confirmación energía cero de la sub estación eléctrica, evaluar', estado: 'NA', observacion: '' }
];

patioObservaciones: PatioObservacion[] = [
  { descripcion: 'Candados y manijas de puertas de acceso', estado: 'NA', observacion: '' },
  { descripcion: 'Señalización de seguridad en cerco, transformador, bandejas', estado: 'NA', observacion: '' },
  { descripcion: 'Bandejas porta cables', estado: 'NA', observacion: '' },
  { descripcion: 'Sistema de iluminación y luces de emergencia en patio', estado: 'NA', observacion: '' }
];

recomendacionesObservaciones: AvisoObservacion[] = Array(5).fill({ recomendacion: '', estado: 'MALO', solicitud: '' });

// --- Extraer datos del PDF ---
private extractPdfFields(): void {
  const q = (selector: string) =>
    document.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(selector);

  const getVal = (name: string) =>
    document.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
      `.textWidgetAnnotation input[name="${name}"],
       .textWidgetAnnotation textarea[name="${name}"],
       .textWidgetAnnotation select[name="${name}"],
       .buttonWidgetAnnotation input[name="${name}"]`
    )?.value?.trim() ?? '';

  const getChecked = (name: string) =>
    !!document.querySelector<HTMLInputElement>(
      `.textWidgetAnnotation input[name="${name}"],
       .buttonWidgetAnnotation input[name="${name}"]`
    )?.checked;

  // --- 1️⃣ Campos generales ---
  this.transformador = getVal('transformador') || this.transformador;
  this.subestacion = getVal('subestacion') || this.subestacion;
  this.ubicacion = getVal('ubicacion') || this.ubicacion;
  this.horaInicio = getVal('hora_inicio') || this.horaInicio;
  this.horaFin = getVal('hora_fin') || this.horaFin;
  this.ordenTrabajo = getVal('orden_trabajo') || this.ordenTrabajo;
  this.fechaOrden = getVal('fecha') || this.fechaOrden;
  this.potenciaActual = getVal('potencia_actual') || this.potenciaActual;
  this.corrienteActual = getVal('corriente_actual') || this.corrienteActual;

  // --- 2️⃣ Seguridad Observaciones (solo BUENO / NA) ---
  const descSeguridad = [
    'Completar los permisos de trabajo según la actividad adjuntados a la OT (IPERC - ATS - PETAR PETS)',
    'Inspección de herramientas y evitar exceso de carga (>25 kg)',
    'Usar implementos de seguridad personal de acuerdo al tipo de trabajo (EPP\'s)',
    'Realizar el aislamiento, bloqueo y confirmación energía cero de la sub estación eléctrica, evaluar'
  ];

  this.seguridadObservaciones = [];
  for (let i = 1; i <= 4; i++) {
    const bueno = getChecked(`bueno_${i}`);
    const na = getChecked(`na_${i}`);
    const obs = getVal(`observacion_${i}`);
    let estado: 'BUENO' | 'NA' = bueno ? 'BUENO' : 'NA';

    this.seguridadObservaciones.push({
      descripcion: descSeguridad[i - 1],
      estado,
      observacion: obs || ''
    });
  }

  // --- 3️⃣ Patio Observaciones (BUENO / MALO / NA) ---
  const descPatio = [
    'Candados y manijas de puertas de acceso',
    'Señalización de seguridad en cerco, transformador, bandejas',
    'Bandejas porta cables',
    'Sistema de iluminación y luces de emergencia en patio'
  ];

  this.patioObservaciones = [];
  for (let i = 1; i <= 4; i++) {
    const bueno = getChecked(`bueno_${4 + i}`); // bueno_5–8
    const malo = getChecked(`malo_${i}`);       // malo_1–4
    const na = getChecked(`na_${4 + i}`);       // na_5–8
    const obs = getVal(`observacion_${4 + i}`); // observacion_5–8

    let estado: 'BUENO' | 'MALO' | 'NA' = 'NA';
    if (bueno) estado = 'BUENO';
    else if (malo) estado = 'MALO';
    else if (na) estado = 'NA';

    this.patioObservaciones.push({
      descripcion: descPatio[i - 1],
      estado,
      observacion: obs || ''
    });
  }

  // --- 4️⃣ Avisos / Recomendaciones (BUENO / MALO) ---
  this.recomendacionesObservaciones = [];
  for (let i = 1; i <= 5; i++) {
    const bueno = getChecked(`bueno_${8 + i}`); // bueno_9–13
    const malo = getChecked(`malo_${4 + i}`);   // malo_5–9
    const solicitud = getVal(`solicitud_${i}`); // solicitud_1–5
    const recomendacion = getVal(`recomendacion_${i}`); // recomendacion_1–5

    const estado: 'BUENO' | 'MALO' = malo ? 'MALO' : 'BUENO';

    this.recomendacionesObservaciones.push({
      recomendacion: recomendacion || '',
      estado,
      solicitud: solicitud || ''
    });
  }

  // --- 🧩 Extracción de ítems dinámicos de equipos ---
const pdfSections = Array.from(document.querySelectorAll<HTMLElement>('.pdf-form-section'));
if (pdfSections.length) {
  const assignToTransformForms = (labelText: string, values: string[] | string) => {
    const setOn = (formObj: any) => {
      if (!formObj || !formObj.items) return false;
      for (const it of formObj.items) {
        const lbl = (it.label || it.descripcion || '').toString().trim();
        if (!lbl) continue;
        if (lbl === labelText || lbl.toLowerCase() === labelText.toLowerCase()) {
          if (Array.isArray(values)) {
            it.valores = [values[0] ?? '', values[1] ?? ''];
          } else {
            it.valor = values as string;
          }
          return true;
        }
      }
      return false;
    };
    if (this.transformador1) {
      setOn(this.transformador1.form1);
      setOn(this.transformador1.form2);
    }
    if (this.transformador2) {
      setOn(this.transformador2.form3);
      setOn(this.transformador2.form4);
    }
  };

  pdfSections.forEach(section => {
    const fieldDivs = Array.from(section.querySelectorAll<HTMLElement>(':scope > div'));
    fieldDivs.forEach(div => {
      const labelEl = div.querySelector('label');
      const label = labelEl?.textContent?.trim() ?? '';
      if (!label) return;
      const inputs = Array.from(div.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('input, textarea, select'));
      if (inputs.length === 0) return;
      if (inputs.length === 1) {
        const v = (inputs[0].value || '').toString().trim();
        assignToTransformForms(label, v);
      } else if (inputs.length === 2) {
        const v0 = (inputs[0].value || '').toString().trim();
        const v1 = (inputs[1].value || '').toString().trim();
        assignToTransformForms(label, [v0, v1]);
      } else {
        const vals = inputs.map(i => (i.value || '').toString().trim());
        assignToTransformForms(label, vals.join(','));
      }
    });
  });
}

}

// --- Utilidad para formatear fecha (YYYY-MM-DD → DD-MM-YYYY)
private formatDate(isoDate: string): string {
  if (!isoDate || !isoDate.includes('-')) return isoDate;
  const [year, month, day] = isoDate.split('-');
  return `${day}-${month}-${year}`;
}

// --- Guardar datos ---
async saveData(): Promise<void> {
  this.extractPdfFields();
  this.modal.confirm({
    nzTitle: 'Confirmación',
    nzContent: '¿Estás seguro de que quieres guardar los datos?',
    nzOkText: 'Aceptar',
    nzCancelText: 'Cancelar',
    nzOnOk: async () => {
      const loadingMessageId = this.messageService.loading('Evaluando los datos, por favor espera...', { nzDuration: 0 }).messageId;
      try {
        const item1 = this.transformador1?.form1?.items ?? [];
        const item2 = this.transformador1?.form2?.items ?? [];
        const item3 = this.transformador2?.form3?.items ?? [];
        const item4 = this.transformador2?.form4?.items ?? [];

        const normalizeItem = (items: any[]) =>
          (items || []).map(it => {
            const normalized: any = {};
            Object.keys(it).forEach(k => {
              const val = it[k];
              normalized[k] = Array.isArray(val) || typeof val === 'object'
                ? JSON.stringify(val)
                : val?.toString() ?? '';
            });
            return normalized;
          });

        const payload: any = {
          hora_inicio: this.horaInicio,
          hora_fin: this.horaFin,
          orden_trabajo: this.ordenTrabajo,
          fecha: this.formatDate(this.fechaOrden),
          seguridad_observaciones: this.seguridadObservaciones,
          patio_observaciones: this.patioObservaciones,
          aviso_observaciones: this.recomendacionesObservaciones,
          item1: normalizeItem(item1),
          item2: normalizeItem(item2),
          item3: normalizeItem(item3),
          item4: normalizeItem(item4),
          id_transformadores: Number(this.id_transformadores) || 0,
          id_usuario: this.idusuario,
          id_usuario_2: this.idusuario2,
          potencia_actual: this.potenciaActual,
          corriente_actual: this.corrienteActual,
          firma_1: this.rutaFirmaSeleccionada || null
        };

        console.log('PM1 payload a enviar:', payload);
        const response: any = await this.pm1Service.postPM1(payload).toPromise();
        const idPm1 = response.lastId ?? response.idPm1 ?? 0;

        if (idPm1) {
          await this.NotificacionService.insertarNotificacionPm1({
            supervisor: this.idusuario2,
            lider: this.idusuario,
            firmado: false,
            id_pm1: idPm1
          }).toPromise();
          this.alertservice.success('Datos Guardados', 'Los datos se han guardado con éxito.');
        } else {
          this.alertservice.error('Error', 'No se obtuvo ID de PM1 después de guardar.');
        }
      } catch (err) {
        console.error('Error guardando PM1:', err);
        this.alertservice.error('Error al Guardar', 'Ha ocurrido un error al guardar los datos.');
      } finally {
        this.messageService.remove(loadingMessageId);
      }
    }
  });
}


// ...existing code...
    seleccionarParticipante(event: any, tipoCargo: string): void {
      const fotocheckSeleccionado = parseInt(event.target.value, 10);

      if (this.usuariosMap.has(fotocheckSeleccionado)) {
        const usuarioSeleccionado = this.usuariosMap.get(fotocheckSeleccionado)!;

        if (tipoCargo === 'TECNICO' && usuarioSeleccionado.cargo === 'TECNICO') {
          this.idusuario = usuarioSeleccionado.idUsuario;
          this.rutaFirmaSeleccionada = usuarioSeleccionado.firma;
          console.log("usuario seleccionado",usuarioSeleccionado);
          this.correoSeleccionado = usuarioSeleccionado.usuario;
          const campoCorreoTecnico = this.annotations.find(annotation => annotation.fieldName.toLowerCase() === 'correo_tecnico');
          if (campoCorreoTecnico?.element) campoCorreoTecnico.element.value = this.correoSeleccionado;
        } else if (tipoCargo === 'SUPERVISOR' && usuarioSeleccionado.cargo === 'SUPERVISOR') {
          this.idusuario2 = usuarioSeleccionado.idUsuario;
          //this.rutaFirmaSeleccionadaSupervisor = usuarioSeleccionado.firma;
          this.correoSeleccionado1 = usuarioSeleccionado.usuario;
          console.log("usuario seleccionado",usuarioSeleccionado);
          const campoCorreoSupervisor = this.annotations.find(annotation => annotation.fieldName.toLowerCase() === 'correo_supervisor');
          if (campoCorreoSupervisor?.element) campoCorreoSupervisor.element.value = this.correoSeleccionado1;
        } else {
          console.error('Operación no válida para el cargo.');
        }
      } else {
        console.error('Usuario no encontrado.');
      }
    }



  VerPlano(): void {
    this.transformadorService.MostrarPlano(this.subestacion, this.transformador).subscribe(
      (pdfBlob: Blob) => {
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Abrir el PDF en una nueva pestaña
        const newTab = window.open();
        if (newTab) {
          newTab.location.href = pdfUrl;
        } else {
          console.error('No se pudo abrir una nueva pestaña.');
          this.alertservice.error('No se pudo abrir el PDF en una nueva pestaña.', 'error');
        }
      },
      (error) => {
        console.error('Error inesperado', error);
        // Aquí puedes agregar un mensaje más descriptivo
        this.alertservice.error('No se encontró el plano', 'error');
      }
    );
  }

}