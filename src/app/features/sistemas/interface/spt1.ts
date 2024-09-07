export interface Spt1 {
  id_spt1: number;
  tag_subestacion: string;
  ot: string;
  fecha: Date;
  pat1: string;
  pat2: string;
  pat3: string;
  pat4: string;
  lider: string;
  supervisor: string;
}

export interface Spt1DTO {
  ot: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  id_subestacion: number;
  id_usuario: number;
  id_usuario_2: number;
  seguridad_observaciones: string;
  tipo_spt1: string;
  barras_equipotenciales: string;
  pozos_a_tierra: string;
  cerco_perimetrico: string;
  transformadores: string;
  observacion_aviso: string;
  aviso: string;
  bueno: string;
  na: string;
}

export interface Spt1ResultDTO {
  electrodo: string | null;
  soldadura: string | null;
  conductor: string | null;
  conector: string | null;
  identificacion: string | null;
  cajaDeRegistro: string | null;
}

export interface BuscarPorId {
  id_spt1: number;
  ot: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  tag_subestacion: string;        // Para la subestación
  ubicacion: string;
  cantidad_spt:string;
  plano :string;             // Para la ubicación de la subestación
  lider: string;                  // Para el líder
  supervisor: string;             // Para el supervisor
  firma_lider: string;            // Para la firma del líder
  fotocheck_lider: string;        // Para el fotocheck del líder
  firma_supervisor: string;       // Para la firma del supervisor
  fotocheck_supervisor: string;   // Para el fotocheck del supervisor
  observacion_aviso: string;      // Para las observaciones de aviso
  aviso: string;                  // Para los avisos
  seguridad_observaciones: string; // Para las observaciones de seguridad
  bueno: string;                  // Para los valores de "bueno"
  na: string;                     // Para los valores de "no aplica"
  barras_equipotenciales: string;  // Para los datos de barras equipotenciales
  pozos_a_tierra: string;         // Para los datos de pozos a tierra
  cerco_perimetrico: string;      // Para los datos del cerco perimétrico
  transformadores: string;        // Para los datos del transformador
  id_tipo_spt1: number;           // Para el ID de tipo SPT1
  aislado: string;                // Para el atributo "aislado" del tipo SPT1
  contrapeso: string;             // Para el atributo "contrapeso" del tipo SPT1
  horizontal: string;             // Para el atributo "horizontal" del tipo SPT1
  vertical: string;               // Para el atributo "vertical" del tipo SPT1
  delta: string;                  // Para el atributo "delta" del tipo SPT1
  malla: string;                  // Para el atributo "malla" del tipo SPT1
}
