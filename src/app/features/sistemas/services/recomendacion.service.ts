import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Recomendacion } from '../interface/recomendacion';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RecomendacionService {

  // Usa la URL base del entorno y añade la ruta específica del recurso
  private apiUrl = `${environment.apiUrl}/Recomendacion`;

  constructor(private http: HttpClient) {}

  insertarRecomendacion(recomendaciones: Recomendacion[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/InsertarRecomendacion`, recomendaciones)
      .pipe(
        catchError(this.handleError)
      );
  }

  buscarRecomendacionPorLote(loteId: number): Observable<Recomendacion[]> {
    return this.http.get<Recomendacion[]>(`${this.apiUrl}/BuscarRecomendacionPorLote/${loteId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError('Something bad happened; please try again later.');
  }
}
