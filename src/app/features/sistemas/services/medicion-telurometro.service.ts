import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { MedicionTelurometro } from '../interface/medicion-telurometro';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class MedicionTelurometroService {

  private apiUrl = `${environment.apiUrl}/MedicionTelurometro`;

  constructor(private http: HttpClient) { }

  // Método para insertar una nueva medición de telurometro
  insertarMedicion(medicion: MedicionTelurometro): Observable<{ insertedId: number }> {
    const url = `${this.apiUrl}/InsertarMedicion`; // Asegúrate de tener el endpoint correcto
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(url, medicion, { headers }).pipe(
      map(response => {
        if (response && response.id !== undefined) {
          // Cambiamos 'idMedicionTelurometro' por 'id'
          return { insertedId: response.id };
        } else {
          throw new Error("La respuesta de la API no contiene 'id'");
        }
      }),
      catchError(this.handleError) // Manejo de errores
    );
  }


  // Método para buscar una medición de telurometro por ID
  buscarMedicionPorId(id: number): Observable<MedicionTelurometro> {
    return this.http.get<MedicionTelurometro>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError) // Manejo de errores
      );
  }

  // Método para manejar errores detallados
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido.';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error del servidor: ${error.status}\nMensaje: ${error.message}`;
    }

    // Mostrar el error en la consola (opcional)
    console.error(errorMessage);

    // Retornar un observable con el mensaje de error
    return throwError(() => new Error(errorMessage));
  }
}
