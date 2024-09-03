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

