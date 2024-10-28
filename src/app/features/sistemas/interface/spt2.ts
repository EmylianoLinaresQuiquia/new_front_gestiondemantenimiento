export interface MostrarSpt2 {
  id_spt2:number;
  ot: string;
  fecha: string;
  tag_subestacion: string;
  caida_potencia: boolean; // Cambiado a boolean
  selectivo: boolean;      // Cambiado a boolean
  sin_picas: boolean;
  pat1_sujecion: number;
  pat2_sujecion: number;
  pat3_sujecion: number;
  pat4_sujecion: number;
  pat1_selectivo: number;
  pat2_selectivo: number;
  pat3_selectivo: number;
  pat4_selectivo: number;
  pat1_caida: number;
  pat2_caida: number;
  pat3_caida: number;
  pat4_caida: number;
  usuario_lider: string;
  usuario_supervisor: string;
}


export interface InsertSpt2{

  ot: string;
  fecha: string;
  firmado: boolean;
  id_usuario: number;
  id_usuario_2: number;
  id_subestacion: number;

  // Datos de metodo_medicion_spt2
  caida_potencia: boolean;
  selectivo: boolean;
  sin_picas: boolean;

  // Datos de metodo_telurometro_spt2
  fecha_calibracion: string;
  marca: string;
  n_serie: string;
  modelo: string;
  frecuencia: string;
  precision: string;

  // Datos de metodo_sujecion_spt2
  conclusiones_sujecion: string;

  // JSON para pat_metodo_spt2
  pats: Array<{
    pat1: number;
    pat2: number;
    pat3: number;
    pat4: number;
    ohm: string;
    resultado: string;
  }>;

  // Datos de metodo_caida_spt2
  esquema_caida:  File| null;
  conclusiones_caida: string;

  // Datos de metodo_selectivo_spt2
  esquema_selectivo:  File| null;
  conclusiones_selectivo: string;


  imagen1: File | null;
  imagen2: File | null;
  imagen3: File | null;
  imagen4: File | null;
}


export interface MostrarSpt2PorId {
  ot: string;
  fecha: string;
  firmado: boolean;
  usuario1_usuario: string;
  usuario1_fotocheck: number;
  usuario1_firma: string;
  usuario2_usuario: string;
  usuario2_fotocheck: number;
  usuario2_firma: string;
  ubicacion: string;
  plano: string;
  fecha_plano: string;
  subestacion_versio: number;
  imagen1: string;
  imagen2: string;
  imagen3: string;
  imagen4: string;
  fecha_calibracion: string;
  marca: string;
  n_serie: string;
  modelo: string;
  frecuencia: string;
  precision: string;
  caida_potencia: boolean;
  selectivo: boolean;
  sin_picas: boolean;
  pat1: string;
  pat2: string;
  pat3: string;
  pat4: string;
  ohm: string;
  resultado: string;
  caida_esquema: string;
  caida_conclusiones: string;
  selectivo_esquema: string;
  selectivo_conclusiones: string;
  sujecion_conclusiones: string;
}
