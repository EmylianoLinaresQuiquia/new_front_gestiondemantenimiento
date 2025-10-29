
  /*id_pm1?: number;
  hora_inicio: string;
  hora_fin: string;
  orden_trabajo: string;
  fecha: string;
  id_seguridad_observaciones_pm1: number;
  id_patio_estado_observaciones: number;
  id_observaciones_aviso_solicitud: number;
  id_transformadores: number;
  id_usuario: number;
  id_grupo: number;
  id_potencia: number;



  // Propiedades adicionales para Transformadores_PM1
  subestacion?: string;
  ubicacion?: string;
  transformador?: string;
  tipo?: string;
  marca?: string;
  voltage?: string;
  potencia?: string;




  seguridad_bueno?: boolean;
  seguridad_na?: boolean;
  seguridad_observaciones?: string;

  patio_bueno?: boolean;
  patio_malo?: boolean;
  patio_na?: boolean;
  patio_observaciones?: string;

  aviso_observaciones?: string;
  aviso_si?: boolean;
  aviso_no?: boolean;
  aviso_solicitud?: string;



  usuario?: string;
  fotocheck?: string;
  firma?: string;

  grupo_seleccionado?: string;
  grupo_ingresado?: string;

  potencia_actual?: string;
  corriente_actual?: string;*/




export interface SeguridadObservacionSPT {
  descripcion: string;          // 🔹 NUEVO → viene de la BD
  estado: 'BUENO' | 'MALO' | 'NA'| string; 
  observacion: string;
}
export interface PatioObservacion {
  descripcion: string;          // 🔹 NUEVO → viene de la BD
  estado: 'BUENO' | 'MALO' | 'NA'; // 🔹 NUEVO → reemplaza a bueno/malo/na
  observacion: string;
}
export interface AvisoObservacion {
  observaciones: string;
  solicita_aviso_sap: 'BUENO' | 'MALO'; // 🔹 NUEVO → campo real en BD
  solicitud: string;                    // 🔹 sigue igual, pero debe respetar varchar(20)
}
export interface Equipo {
  seleccionados: string[]; // Ahora es una lista de seleccionados
  valor_real?: number[];
  valor_testigo?: number[];
}

export interface PM1 {
  id_pm1?:number;
  hora_inicio: string;
  hora_fin: string;
  orden_trabajo: string;
  fecha: string;
  seguridad_observaciones: SeguridadObservacionSPT[];
  patio_observaciones: PatioObservacion[];
  aviso_observaciones: AvisoObservacion[];
  id_transformadores: number;
  id_usuario: number;
  id_usuario_2: number;

  potencia_actual: string; // Nueva propiedad
  corriente_actual: string;
  item1: { [key: string]: string }[] | null;
  item2: { [key: string]: string }[] | null;
  item3: { [key: string]: string }[] | null;
  item4: { [key: string]: string }[] | null;
}
export interface BuscarPM1PorId {
  id_pm1: number;
  hora_inicio: string;
  hora_fin: string;
  orden_trabajo: string;
  firma:boolean;
  fecha: string;
  correo_tecnico: string;
  fotocheck_tecnico: string;
  firma_1: string;
  correo_supervisor: string;
  fotocheck_supervisor: string;
  firma_2: string;
  tag_subestacion: string;
  ubicacion: string;
  transformador: string;
  potencia: string;
  potencia_actual: string;
  corriente_actual: string;
  seguridad_observaciones: string;
  patio_observaciones: string;
  aviso_observaciones: string;
  equipo_item1?: string;
  equipo_item2?: string;
  equipo_item3?: string;
  equipo_item4?: string;
  equipos?: string | any
}

export interface MOSTRARPM1{
  id_pm1?:number;

  orden_trabajo: string;
  firma:boolean;
  fecha: string;

  usuario: string;
  usuario_2: string;
  subestacion:string;
  transformador:string
}


