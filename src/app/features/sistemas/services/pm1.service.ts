import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PM1,BuscarPM1PorId } from '../interface/pm1';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PM1Service {

  // Usa la URL base del entorno y añade la ruta específica del recurso
  private apiUrl = `${environment.apiUrl}/PM1`;

  constructor(private http: HttpClient) {}

  postPM1(pm1: PM1): Observable<any> {
    const url = `${this.apiUrl}/InsertarPm1`; // Usa la URL base y añade la ruta específica
    return this.http.post<any>(url, pm1, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      map(response => response.lastId), // Asumiendo que el 'id' es devuelto en la respuesta como { id: <valor> }
      catchError(this.handleError('postPM1'))
    );
  }



  mostrarPM1(subestacion: string, transformador: string): Observable<any> {
    const params = new HttpParams()
      .set('subestacion', subestacion)
      .set('transformador', transformador);

    return this.http.get<any>(`${this.apiUrl}/MostrarPM1`, { params })
      .pipe(
        catchError(this.handleError('mostrarPM1'))
      );
  }

  mostrarDashboarPM1(subestacion: string, transformador: string): Observable<any> {
    const params = new HttpParams()
      .set('subestacion', subestacion)
      .set('transformador', transformador);

    return this.http.get<any>(`${this.apiUrl}/MostrarDashboarPM1`, { params })
      .pipe(
        catchError(this.handleError('mostrarDashboarPM1'))
      );
  }

  getPM1(): Observable<PM1[]> {
    return this.http.get<PM1[]>(this.apiUrl).pipe(
      catchError(this.handleError<PM1[]>('getPM1', []))
    );
  }

  getPM1ById(id: number): Observable<BuscarPM1PorId> {
    return this.http.get<BuscarPM1PorId>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError<BuscarPM1PorId>('getPM1ById'))
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



  // Obtener todos los registros
  /*getPM1s(): Observable<PM1[]> {
    return this.http.get<PM1[]>(this.apiUrl);
}

  // Obtener un registro por ID
  getPM1ById(id: number): Observable<PM1> {
    return this.http.get<PM1>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo registro
  createPM1(pm1: PM1): Observable<PM1> {
    return this.http.post<PM1>(`${this.apiUrl}`, pm1).pipe(
      catchError(error => {
        console.error('Error al crear el registro:', error);
        throw error; // Re-lanzar el error para que el componente pueda manejarlo
      })
    );
  }


  // Eliminar un registro por ID
  deletePM1(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

   // Obtener registros por ID de seguridad observaciones
   getByIdSeguridadObservaciones(id: number): Observable<PM1[]> {
    return this.http.get<PM1[]>(`${this.apiUrl}/SeguridadObservaciones/${id}`);
  }

  // Obtener registros por ID de patio estado observaciones
  getByIdPatioEstadoObservaciones(id: number): Observable<PM1[]> {
    return this.http.get<PM1[]>(`${this.apiUrl}/PatioEstadoObservaciones/${id}`);
  }

  // Obtener registros por ID de observaciones aviso solicitud
  getByIdObservacionesAvisoSolicitud(id: number): Observable<PM1[]> {
    return this.http.get<PM1[]>(`${this.apiUrl}/ObservacionesAvisoSolicitud/${id}`);
  }

  // Obtener registros por ID de transformadores
  getByIdTransformadores(id: number): Observable<PM1[]> {
    return this.http.get<PM1[]>(`${this.apiUrl}/Transformadores/${id}`);
  }

  // Obtener registros por ID de usuario
  getByIdUsuario(id: number): Observable<PM1[]> {
    return this.http.get<PM1[]>(`${this.apiUrl}/Usuario/${id}`);
  }

  // Obtener registros por ID de grupo
  getByIdGrupo(id: number): Observable<PM1[]> {
    return this.http.get<PM1[]>(`${this.apiUrl}/Grupo/${id}`);
  }

  // Obtener registros por ID de potencia
  getByIdPotencia(id: number): Observable<PM1[]> {
    return this.http.get<PM1[]>(`${this.apiUrl}/Potencia/${id}`);
  }
  */
}
