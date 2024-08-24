export interface Spt1 {
  id_spt1?:number;
  tagSubestacion: string;
  ot: string;
  ubicacion: string;
  fecha: string;
  lider: string;
  supervisor: string;
  inicio: string;
  fin: string;
  firma:boolean;
  Pat1Spt1Id: number;
  Pat2Spt1Id: number;
  Pat3Spt1Id: number;
  Pat4Spt1Id: number;


  lote_id:number;

  barra_e_noAi_lote_id :number;
  barra_e_Ai_lote_id :number;
  cerco_p_noAi_lote_id :number;
  cerco_p_Ai_lote_id :number;
  transformador_noAi_lote_id :number;
  id_tipostp:number;
  recomendacion_lote_id:number;

  pat1Spt1Id?:number;
  pat2Spt1Id?:number;
  pat3Spt1Id?:number;
  pat4Spt1Id?:number;

}
