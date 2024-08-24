import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Seguridadobservacion } from '../interface/seguridadobservacion';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SeguridadobservacionService {

  // Usa la URL base del entorno y añade la ruta específica del recurso
  private apiUrl = `${environment.apiUrl}/SeguridadObservacion`;

  constructor(private http: HttpClient) {}

  insertarCincoObservaciones(observaciones: Seguridadobservacion[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/InsertarCincoObservaciones`, observaciones).pipe(
      map(response => {
        console.log("Response from server: ", response);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  buscarPorLoteId(loteId: number): Observable<Seguridadobservacion> {
    return this.http.get<Seguridadobservacion>(`${this.apiUrl}/BuscarPorLoteID/${loteId}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    return throwError('Something bad happened; please try again later.');
  }
}
