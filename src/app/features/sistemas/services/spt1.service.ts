import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Spt1 } from '../interface/spt1';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class Spt1Service {

  // Usa la URL base del entorno y añade la ruta específica del recurso
  private apiURL = `${environment.apiUrl}/Spt1`;

  constructor(private http: HttpClient) {}

  insertarSpt1(spt1: Spt1): Observable<any> {
    return this.http.post(`${this.apiURL}/Insertar`, spt1)
      .pipe(
        catchError(this.handleError) // manejar errores
      );
  }

  eliminarSpt1(id: number): Observable<any> {
    return this.http.delete(`${this.apiURL}/Eliminar/${id}`)
      .pipe(
        catchError(this.handleError) // manejar errores
      );
  }

  buscarSpt1PorId(id: number): Observable<Spt1> {
    const url = `${this.apiURL}/BuscarPorId/${id}`;
    return this.http.get<Spt1>(url).pipe(catchError(this.handleError));
  }

  mostrarTodosSpt1(): Observable<Spt1[]> {
    return this.http.get<Spt1[]>(`${this.apiURL}/MostrarTodos`);
  }

  buscarPorTagSubestacion(tagSubestacion: string): Observable<Spt1[]> {
    return this.http.get<Spt1[]>(`${this.apiURL}/BuscarPorTagSubestacion/${tagSubestacion}`);
  }

  actualizarFirma(id_spt1: number, firma: boolean): Observable<any> {
    return this.http.put(`${this.apiURL}/ActualizarFirma/${id_spt1}`, firma);
  }

  buscarPorTagSubestacionYOt(tagSubestacion: string, ot: string): Observable<Spt1[]> {
    return this.http.get<Spt1[]>(`${this.apiURL}/BuscarPorTagSubestacionYOt/${tagSubestacion}/${ot}`);
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
