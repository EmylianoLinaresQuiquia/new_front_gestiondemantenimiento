import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Spt1,Spt1DTO,Spt1ResultDTO ,BuscarPorId} from '../interface/spt1';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class Spt1Service {

  constructor(private http: HttpClient) {}
  private apiURL = `${environment.apiUrl}/Spt1`;

  insertarSpt1(spt1Dto: Spt1DTO): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/insert`, spt1Dto)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message || 'Error inesperado');
          }
          return response;
        }),
        catchError(this.handleError<any>('insertarSpt1'))
      );
  }

  mostrarSpt1(): Observable<Spt1[]> {
    return this.http.get<Spt1[]>(`${this.apiURL}/mostrar`).pipe(
      catchError(this.handleError<Spt1[]>('mostrarSpt1', []))
    );
  }

  buscarSpt1PorId(id_spt1: number): Observable<BuscarPorId[]> {
    return this.http.get<BuscarPorId[]>(`${this.apiURL}/BuscarSpt1PorId/${id_spt1}`).pipe(
      catchError(this.handleError<BuscarPorId[]>('buscarSpt1PorId', []))
    );
  }

  ejecutarTotalSpt1Pat1(): Observable<Spt1ResultDTO[]> {
    return this.http.get<Spt1ResultDTO[]>(`${this.apiURL}/TotalSpt1Pat1`).pipe(
      catchError(this.handleError<Spt1ResultDTO[]>('ejecutarTotalSpt1Pat1', []))
    );
  }

  ejecutarTotalSpt1Pat2(): Observable<Spt1ResultDTO[]> {
    return this.http.get<Spt1ResultDTO[]>(`${this.apiURL}/TotalSpt1Pat2`).pipe(
      catchError(this.handleError<Spt1ResultDTO[]>('ejecutarTotalSpt1Pat2', []))
    );
  }

  ejecutarTotalSpt1Pat3(): Observable<Spt1ResultDTO[]> {
    return this.http.get<Spt1ResultDTO[]>(`${this.apiURL}/TotalSpt1Pat3`).pipe(
      catchError(this.handleError<Spt1ResultDTO[]>('ejecutarTotalSpt1Pat3', []))
    );
  }

  ejecutarTotalSpt1Pat4(): Observable<Spt1ResultDTO[]> {
    return this.http.get<Spt1ResultDTO[]>(`${this.apiURL}/TotalSpt1Pat4`).pipe(
      catchError(this.handleError<Spt1ResultDTO[]>('ejecutarTotalSpt1Pat4', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`, error);

      let errorMessage = 'Ha ocurrido un error al guardar los datos.';
      if (error.error && error.error.details) {
        errorMessage = error.error.details;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      return throwError(() => new Error(errorMessage));
    };
  }

  /*insertarSpt1(spt1: spt1dto): Observable<any> {
    return this.http.post(`${this.apiURL}`, spt1)
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
  }*/

}
