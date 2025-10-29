export interface Notificacion {
    idnotificacion?:number;
   fecha?:string;
  lider: number | null;
  supervisor: number | null;
  id_pm1?:number;
  id_spt2?: number; // Hacer opcional
  id_spt1?: number; // Hacer opcional
  firmado:boolean
}


export interface NotificacionPendiente {
  idnotificacion?:number;
 fecha?:string;
 nombre_lider: string;
 nombre_supervisor: string;
 ot: number;
 tag_subestacion: number;
id_pm1?:number;
id_spt2?: number; // Hacer opcional
id_spt1?: number; // Hacer opcional
firmado:boolean
}
