export interface MostrarSpt2 {
  id_spt2:number;
  ot: string;
  fecha: string;
  tag_subestacion: string;
  caida_potencia: boolean; // Cambiado a boolean
  selectivo: boolean;      // Cambiado a boolean
  sin_picas: boolean;
  ohm_caida:string;
  ohm_selectivo:string;
  ohm_sujecion:string;
  usuario_lider: string;
  usuario_supervisor: string;
}


export interface InsertSpt2 {
  [key: string]: any; // Permite agregar dinámicamente propiedades si es necesario
  idSpt2?: number; // Propiedad opcional para el ID generado

  // Parámetros generales
  Ot: string;
  Fecha: string;
  Firmado: boolean;
  IdUsuario: number;
  IdUsuario2: number;
  IdSubestacion: number;

  // Imágenes y esquemas como base64 o null
  Imagen1: File | null; // Cambiado a File
  Imagen2: File | null;
  Imagen3: File | null;
  Imagen4: File | null;
  EsquemaCaida: File | null;
  EsquemaSelectivo: File | null;

  // Valores para metodo_medicion_spt2
  CaidaPotencia: boolean;
  Selectivo: boolean;
  SinPicas: boolean;

  // Valores para metodo_telurometro_spt2
  FechaCalibracion: string;
  Marca: string;
  NumeroSerie: string; // Asegurarse de usar el nombre correcto en la API
  Modelo: string;
  Frecuencia: string;
  Precision: string;

  // Valores para metodo_sujecion_spt2
  ConclusionesSujecion: string;

  // JSON para metodos
  JsonPatsSelectivo: string;
  JsonPatsCaida: string;
  JsonPatsSujecion: string;

  // Valores para metodo_caida_spt2
  ConclusionesCaida: string;

  // Valores para metodo_selectivo_spt2
  ConclusionesSelectivo: string;
}














export interface MostrarSpt2PorId {
  datosSpt2: DatosSpt2;
  metodoCaida: MetodoCaida[];
  metodoSelectivo: MetodoSelectivo[];
  metodoSujecion: MetodoSujecion[];
}

export interface DatosSpt2 {
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
  tag_subestacion:string;
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
}

export interface MetodoCaida {
  id_metodo_caida_spt2: number;
  caida_esquema: string | null;
  caida_conclusiones: string | null;
  id_spt2: number;
  id_grupo: number;
  pat1: number | null;
  pat2: number | null;
  pat3: number | null;
  pat4: number | null;
  ohm: string;
  resultado: string;
}

export interface MetodoSelectivo {
  id_metodo_selectivo_spt2: number;
  selectivo_esquema: string | null;
  selectivo_conclusiones: string | null;
  id_spt2: number;
  id_grupo: number;
  pat1: number | null;
  pat2: number | null;
  pat3: number | null;
  pat4: number | null;
  ohm: string;
  resultado: string;
}

export interface MetodoSujecion {
  id_metodo_sujecion_spt2: number;
  sujecion_conclusiones: string | null;
  id_spt2: number;
  id_grupo: number;
  ohm: string;
  resultado: string;
}
