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
          'border': 'none',
          'outline': 'none',
        });
      } else {
        // ✏️ Caso input o textarea de texto
        setStyle(input, {
          'background-color': '#00000000',
          'color': 'black',
         'border': 'none',
        });
      }
    }
   
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
          input1.style.borderRadius = '4px';
          const input2 = document.createElement('input');
          input2.placeholder = 'v. testigo';
          input2.value = item.valores[1] || '';
          input2.style.width = '70px';
          input2.style.border = '1px solid #aaa';
          input2.style.borderRadius = '4px';
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
    top: '96.5%',   // ← ajusta según el lugar exacto en el PDF
    left: '18%',
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
    fotocheck_tecnico();
    fotocheck_supervisor();
  };
  

  applyAll();

  const observer = new MutationObserver(() => applyAll());
  observer.observe(document.querySelector('ngx-extended-pdf-viewer') ?? document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
  });
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
seguridadObservaciones = [
  { descripcion: 'Completar los permisos de trabajo según la actividad adjuntados a la OT (IPERC - ATS - PETAR PETS)', estado: 'NA', observacion: '' },
  { descripcion: 'Inspección de herramientas y evitar exceso de carga (>25 kg)', estado: 'NA', observacion: '' },
  { descripcion: 'Usar implementos de seguridad personal de acuerdo al tipo de trabajo (EPP\'s)', estado: 'NA', observacion: '' },
  { descripcion: 'Realizar el aislamiento, bloqueo y confirmación energía cero de la sub estación eléctrica, evaluar', estado: 'NA', observacion: '' }
];

potenciaActual: string = '';
corrienteActual: string = '';
 patioObservaciones: PatioObservacion[] = [
   { descripcion: 'Candados y manijas de puertas de acceso', estado: 'NA', observacion: '' },
  { descripcion: 'Señalizacion de seguridad en cerco, transformador, bandejas', estado: 'NA', observacion: '' },
   { descripcion: 'Bandejas porta cables', estado: 'NA', observacion: '' },
   { descripcion: 'Sistema de iluminación y luces de emergencia en patio', estado: 'NA', observacion: '' }
 ];

 recomendacionesObservaciones: AvisoObservacion[] = [
   { recomendacion: '', estado: 'MALO', solicitud: '' },
   { recomendacion: '', estado: 'MALO', solicitud: '' },
   { recomendacion: '', estado: 'MALO', solicitud: '' },
   { recomendacion: '', estado: 'MALO', solicitud: '' },
  { recomendacion: '', estado: 'MALO', solicitud: '' }
 ];


// ...existing code...
  private extractPdfFields(): void {
    // Helpers
    const q = (selector: string) =>
      document.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(selector);

    const getVal = (name: string) =>
      q(`.textWidgetAnnotation input[name="${name}"], .textWidgetAnnotation textarea[name="${name}"], .textWidgetAnnotation select[name="${name}"]`)?.value?.trim() ?? '';

    const getChecked = (name: string) => {
      const el = document.querySelector<HTMLInputElement>(`.textWidgetAnnotation input[name="${name}"]`);
      if (!el) return false;
      if (el.type === 'checkbox' || el.type === 'radio') return !!el.checked;
      return el.value === '1' || el.value === 'true';
    };

    // 1) Campos simples del PDF (annotation layer)
    this.transformador = getVal('transformador') || this.transformador;
    this.subestacion = getVal('subestacion') || this.subestacion;
    this.ubicacion = getVal('ubicacion') || this.ubicacion;
    this.horaInicio = getVal('hora_inicio') || this.horaInicio;
    this.horaFin = getVal('hora_fin') || this.horaFin;
    this.ordenTrabajo = getVal('orden_trabajo') || this.ordenTrabajo;
    this.fechaOrden = getVal('fecha') || this.fechaOrden;
    this.potenciaActual = getVal('potencia_actual') || this.potenciaActual;
    this.corrienteActual = getVal('corriente_actual') || this.corrienteActual;

    // fotocheck / correo / firma (annotation)
    const fototecVal = getVal('fotocheck_tecnico');
    if (fototecVal) this.fotocheckSeleccionado = Number(fototecVal);
    const fotospVal = getVal('fotocheck_supervisor');
    if (fotospVal) this.fotocheckSeleccionado1 = Number(fotospVal);
    const f1 = getVal('firma_1');
    const f2 = getVal('firma_2');
    if (f1) this.rutaFirmaSeleccionada = f1;

    // 2) Seguridad -> usar nueva estructura SeguridadObservacionSPT (estado: 'BUENO'|'MALO'|'NA', observacion)
    for (let i = 1; i <= 4; i++) {
      const bueno = getChecked(`bueno_${i}`);
      const na = getChecked(`na_${i}`);
      const obs = getVal(`observacion_${i}`);
      const idx = i - 1;

      let estado: SeguridadObservacionSPT['estado'] = 'NA';
      if (bueno) estado = 'BUENO';
      else if (na) estado = 'NA';
      else estado = 'MALO';

      if (!this.seguridadObservaciones[idx]) {
        this.seguridadObservaciones[idx] = { descripcion: '', estado, observacion: obs || '' };
      } else {
        this.seguridadObservaciones[idx].estado = estado;
        this.seguridadObservaciones[idx].observacion = obs || '';
      }
    }

    // 3) Patio -> usar nueva estructura PatioObservacion (estado + observacion)
    for (let i = 0; i < 4; i++) {
      const bueno = getChecked(`bueno_${5 + i}`);
      const malo = getChecked(`malo_${1 + i}`);
      const na = getChecked(`na_${5 + i}`);
      const obs = getVal(`observacion_${5 + i}`);
      const idx = i;

      let estado: PatioObservacion['estado'] = 'NA';
      if (bueno) estado = 'BUENO';
      else if (malo) estado = 'MALO';
      else if (na) estado = 'NA';
      else estado = 'NA';

      if (!this.patioObservaciones[idx]) {
        this.patioObservaciones[idx] = { descripcion: '', estado, observacion: obs || '' };
      } else {
        this.patioObservaciones[idx].estado = estado;
        this.patioObservaciones[idx].observacion = obs || '';
      }
    }

    // 4) Aviso / recomendaciones -> mapear a AvisoObservacion (observaciones, solicita_aviso_sap, solicitud)
    for (let i = 0; i < 5; i++) {
      const recom = getVal(`recomendacion_${i + 1}`);
      const bueno = getChecked(`bueno_${9 + i}`); // representa "si"/solicita
      const solicitud = getVal(`solicitud_${i + 1}`);
      const idx = i;

      const estado: AvisoObservacion['estado'] = bueno ? 'BUENO' : 'MALO';

      if (!this.recomendacionesObservaciones[idx]) {
        this.recomendacionesObservaciones[idx] = { recomendacion: recom || '', estado, solicitud: solicitud || '' };
      } else {
        this.recomendacionesObservaciones[idx].recomendacion = recom || '';
        this.recomendacionesObservaciones[idx].estado = estado;
        this.recomendacionesObservaciones[idx].solicitud = solicitud || '';
      }
    }

    // 5) Formularios flotantes (.pdf-form-section) — asignar por label a los items existentes
    const pdfSections = Array.from(document.querySelectorAll<HTMLElement>('.pdf-form-section'));
    if (pdfSections.length) {
      const assignToTransformForms = (labelText: string, values: string[] | string) => {
        const setOn = (formObj: any) => {
          if (!formObj || !formObj.items) return false;
          for (const it of formObj.items) {
            const lbl = (it.label || '').toString().trim();
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
// ...existing code...

  // ...existing code...
 // ...existing code...
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
          // obtener items como ARRAYS (no strings)
          const item1 = this.transformador1?.form1?.items ?? [];
          const item2 = this.transformador1?.form2?.items ?? [];
          const item3 = this.transformador2?.form3?.items ?? [];
          const item4 = this.transformador2?.form4?.items ?? [];

          const idTransformadorNum = this.id_transformadores ? Number(this.id_transformadores) : 0;
          

          // convertir todos los valores no string a string
          const normalizeItem = (items: any[]) => 
            (items || []).map(it => {
              const normalized: any = {};
              Object.keys(it).forEach(k => {
                const val = it[k];
                normalized[k] = Array.isArray(val) || typeof val === 'object'
                  ? JSON.stringify(val)  // ✅ convertir arrays/objetos a string
                  : val?.toString() ?? '';
              });
              return normalized;
            });

          // construir payload EXACTO (sin wrapper { request: ... })
          const payload: any = {
            hora_inicio: this.horaInicio || '',
            hora_fin: this.horaFin || '',
            orden_trabajo: this.ordenTrabajo || '',
            fecha: this.fechaOrden || '',

            seguridad_observaciones: (this.seguridadObservaciones as SeguridadObservacionSPT[] || []).map(s => ({
              descripcion: s.descripcion || '',
              estado: (s.estado as 'BUENO'|'MALO'|'NA') || 'NA',
              observacion: s.observacion || ''
            })),

            patio_observaciones: (this.patioObservaciones as PatioObservacion[] || []).map(p => ({
              descripcion: p.descripcion || '',
              estado: (p.estado as 'BUENO'|'MALO'|'NA') || 'NA',
              observacion: p.observacion || ''
            })),

            aviso_observaciones: (this.recomendacionesObservaciones as AvisoObservacion[] || []).map(a => ({
              recomendacion: a.recomendacion || '',
              estado: (a.estado === 'BUENO' ? 'BUENO' : 'MALO'),
              solicitud: (a.solicitud || '').toString().substring(0, 20)
            })),

            // items => enviar como arrays (según ejemplo que enviaste)
             item1: normalizeItem(item1),
            item2: normalizeItem(item2),
            item3: normalizeItem(item3),
            item4: normalizeItem(item4),
            id_transformadores: idTransformadorNum,
            id_usuario: this.idusuario,
            id_usuario_2: this.idusuario2,

            potencia_actual: this.potenciaActual || '',
            corriente_actual: this.corrienteActual || '',
            firma_1: this.rutaFirmaSeleccionada || null
          };

          // enviar DIRECTAMENTE el payload (sin envolver)
          console.log('PM1 payload a enviar:', payload);
          const response: any = await this.pm1Service.postPM1(payload).toPromise();
          console.log('Respuesta al guardar PM1:', response);
          const idPm1 = response.lastId ?? response.idPm1 ?? 0;

          if (idPm1) {
            const notificacion: Notificacion = {
              supervisor: this.idusuario2,
              lider: this.idusuario,
              firmado: false,
              id_pm1: idPm1
            };
            console.log('Enviando notificación PM1:', notificacion);
            await this.NotificacionService.insertarNotificacionPm1(notificacion).toPromise();

            this.messageService.remove(loadingMessageId);
            this.alertservice.success('Datos Guardados', 'Los datos se han guardado con éxito.');
          } else {
            this.messageService.remove(loadingMessageId);
            this.alertservice.error('Error', 'No se obtuvo ID de PM1 después de guardar.');
          }
        } catch (err) {
          this.messageService.remove(loadingMessageId);
          console.error('Error guardando PM1:', err);
          this.alertservice.error('Error al Guardar', 'Ha ocurrido un error al guardar los datos.');
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
