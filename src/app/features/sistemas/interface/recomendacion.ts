export interface Recomendacion {

  recomendacion_lote_id?: number;  // El '?' indica que es opcional (para cuando se crea una nueva recomendación)
  observacion: string;
  aviso: string;
}
