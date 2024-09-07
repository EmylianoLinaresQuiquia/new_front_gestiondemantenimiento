export interface Notificacion {
    idnotificacion?:number;
   fecha?:string;
  id_usuario: number;
  id_pm1?:number;
  id_spt2?: number; // Hacer opcional
  id_spt1?: number; // Hacer opcional
  firmado:boolean
}
