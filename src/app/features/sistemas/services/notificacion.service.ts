import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Notificacion, NotificacionPendiente } from '../interface/notificacion';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  // Usa la URL base del entorno y añade la ruta específica del recurso
  private apiUrl = `${environment.apiUrl}/notificacion`;

  constructor(private http: HttpClient) { }

  obtenerNotificaciones(): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  insertarNotificacionPm1(notificacion: Notificacion): Observable<any> {
    const url = `${this.apiUrl}/InsertarNotificacionPm1`;
    return this.http.post(url, notificacion).pipe(
      catchError(this.handleError)
    );
  }

  insertarNotificacionSpt1(notificacion: Notificacion): Observable<any> {
    const url = `${this.apiUrl}/InsertarNotificacionSpt1`;
    return this.http.post(url, notificacion).pipe(
      catchError(this.handleError)
    );
  }

  insertarNotificacionSpt2(notificacion: Notificacion): Observable<any> {
    const url = `${this.apiUrl}/InsertarNotificacionSpt2`; // Corregir el endpoint
    return this.http.post(url, notificacion).pipe(
      catchError(this.handleError)
    );
}




  obtenerNotificacionesFirmadas(supervisor: number): Observable<NotificacionPendiente[]> {
    const url = `${this.apiUrl}/NotificacionesFirmadas?supervisor=${supervisor}`;
    return this.http.get<NotificacionPendiente[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  obtenerNotificacionesPendientes(supervisor: number): Observable<NotificacionPendiente[]> {
    const url = `${this.apiUrl}/NotificacionesPendientes?supervisor=${supervisor}`;
    return this.http.get<NotificacionPendiente[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  actualizarFirmaNotificacion(idNotificacion: number, firmado: boolean): Observable<any> {
    const url = `${this.apiUrl}/ActualizarFirma/${idNotificacion}`;
    return this.http.put(url, firmado).pipe(
      catchError(this.handleError)
    );
  }

  eliminarNotificacion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
