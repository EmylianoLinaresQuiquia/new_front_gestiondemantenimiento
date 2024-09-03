import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Spt1,Spt1DTO } from '../interface/spt1';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class Spt1Service {

  // Usa la URL base del entorno y añade la ruta específica del recurso
  private apiURL = `${environment.apiUrl}/Spt1`;

  constructor(private http: HttpClient) {}
  insertarSpt1(spt1Dto: Spt1DTO): Observable<any> {
    // Enviar spt1Dto directamente sin envolverlo en un objeto
    return this.http.post<any>(`${this.apiURL}/insert`, spt1Dto)
      .pipe(
        catchError(this.handleError)
      );
  }

  mostrarSpt1(): Observable<Spt1[]> {
    const url = `${this.apiURL}/mostrar`;
    return this.http.get<Spt1[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  buscarSpt1PorId(id_spt1: number): Observable<Spt1DTO[]> {
    const url = `${this.apiURL}/BuscarSpt1PorId/${id_spt1}`;
    return this.http.get<Spt1DTO[]>(url).pipe(
      catchError(this.handleError)
    );
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

    private handleError(error: HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        console.error('An error occurred:', error.error.message);
      } else {
        // Imprime la respuesta del servidor en formato JSON
        console.error(`Backend returned code ${error.status}, body was: ${JSON.stringify(error.error)}`);

        // Si hay un error de validación (400), detalla los errores específicos
        if (error.status === 400 && error.error.errors) {
          for (const [key, value] of Object.entries(error.error.errors)) {
            console.error(`Validation error - ${key}: ${value}`);
          }
        }
      }
      return throwError('Something bad happened; please try again later.');
    }

}
