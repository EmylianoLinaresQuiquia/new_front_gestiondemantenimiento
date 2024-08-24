import { Injectable } from '@angular/core';
import { Pat1spt1 } from '../interface/pat1spt1';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class Pat1spt1Service {

  // Usa la URL base del entorno y añade la ruta específica del recurso
  private baseUrl = `${environment.apiUrl}/Pat1Spt1`;

  constructor(private http: HttpClient) { }

  insertarPat1Spt1(data: Pat1spt1[]): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/InsertarPat1Spt1`, data).pipe(
      tap(),
      catchError(this.handleError)
    );
  }

  buscarPorIdtablaPat1Spt1(id: number): Observable<Pat1spt1[]> {
    return this.http.get<Pat1spt1[]>(`${this.baseUrl}/buscarPorIdtablaPat1Spt1/${id}`).pipe(
      tap(),
      catchError(this.handleError)
    );
  }

  obtenerGraficaTablaPat1Spt1(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/GraficaTablaPat1Spt1`).pipe(
      tap(),
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
