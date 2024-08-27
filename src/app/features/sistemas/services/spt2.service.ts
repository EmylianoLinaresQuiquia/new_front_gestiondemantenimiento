import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Spt2 } from '../interface/spt2';
import { catchError } from 'rxjs';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class Spt2Service {

  // Usa la URL base del entorno y añade la ruta específica del recurso
  private apiUrl = `${environment.apiUrl}/spt2`;

  constructor(private http: HttpClient) { }

  mostrarListaSpt2(): Observable<Spt2[]> {
    return this.http.get<Spt2[]>(this.apiUrl);
  }

  insertarSpt2(spt2: Spt2): Observable<any> {
    return this.http.post(this.apiUrl, spt2).pipe(
      catchError(this.handleError)
    );
  }

  buscarSpt2PorId(id: number): Observable<Spt2> {
    const url = `${this.apiUrl}/BuscarPorId/${id}`;
    return this.http.get<Spt2>(url).pipe(catchError(this.handleError));
  }

  eliminarSpt2(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente o problemas de red
      console.error('Error del lado del cliente:', error.error.message);
    } else {
      // Error del lado del servidor
      console.error(`Error del servidor (código ${error.status}): `, error.error);
    }
    // Retorna un observable con un mensaje de error
    return throwError('Algo salió mal; por favor, intenta más tarde.');
  }

  buscarPorSubestacion(tagSubestacion: string): Observable<Spt2[]> {
    // Usa un parámetro de consulta para pasar tagSubestacion
    return this.http.get<Spt2[]>(`${this.apiUrl}/BuscarPorTag`, { params: { tagSubestacion } });
  }

  buscarPorSubestacionyot(tagSubestacion: string, ot: string): Observable<Spt2[]> {
    const params = { tagSubestacion, ot };
    return this.http.get<Spt2[]>(`${this.apiUrl}/BuscarPorTagYOt`, { params });
  }

  actualizarFirma(idSpt2: number, firma: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/ActualizarFirma/${idSpt2}`, firma);
  }

  mostrarSpt2Firmados(): Observable<Spt2[]> {
    const url = `${this.apiUrl}/MostrarFirmados`;
    return this.http.get<Spt2[]>(url).pipe(
      catchError(this.handleError)
    );
  }




/*  buscarPorSubestacionyot(tagSubestacion: string, ot: string): Observable<Spt2[]> {
    return this.http.get<Spt2[]>(`${this.apiUrl}/Spt2/BuscarPorSubestacionyot/${tagSubestacion}/${ot}`);
  }*/
  /*buscarPorSubestacion(tagSubestacion: string): Observable<Spt2[]> {
    return this.http.get<Spt2[]>(`${this.apiUrl}/Spt2/BuscarPorSubestacion/${tagSubestacion}`);
  }*/

 // Método para eliminar un registro por ID
 /*eliminarRegistro(id: number): Observable<any> {
  const url = `${this.apiUrl}/Spt2/eliminar/${id}`;
  return this.http.post(url, {});
}

insertarDatosEnSpt2(): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/Spt2`, {}).pipe(
    catchError((error) => {
      // Imprimir la respuesta completa del servidor para obtener más detalles
      console.error('Error al insertar datos en Spt2:', error);
      return throwError(error);
    })
  );*
}



  /*

  private apiUrl = 'https://appservice-webapp-progideas.azurewebsites.net/api';

  constructor(private http: HttpClient) {}

  insertarDatosEnSpt2(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Spt2`, {}).pipe(
      catchError((error) => {
        // Imprimir la respuesta completa del servidor para obtener más detalles
        console.error('Error al insertar datos en Spt2:', error);
        return throwError(error);
      })
    );
  }


  mostrarListaSpt2(): Observable<Spt2[]> {
    return this.http.get<Spt2[]>(`${this.apiUrl}/Spt2`);
  }

  buscarPorSubestacionyot(tagSubestacion: string, ot: string): Observable<Spt2[]> {
    return this.http.get<Spt2[]>(`${this.apiUrl}/Spt2/BuscarPorSubestacionyot/${tagSubestacion}/${ot}`);
  }
  buscarPorSubestacion(tagSubestacion: string): Observable<Spt2[]> {
    return this.http.get<Spt2[]>(`${this.apiUrl}/Spt2/BuscarPorSubestacion/${tagSubestacion}`);
  }

 // Método para eliminar un registro por ID
 eliminarRegistro(id: number): Observable<any> {
  const url = `${this.apiUrl}/Spt2/eliminar/${id}`;
  return this.http.post(url, {});
}

// Método para actualizar un registro por ID
actualizarRegistro(id: number, nuevoRegistro: any): Observable<any> {
  const url = `${this.apiUrl}/Spt2/actualizar/${id}`;
  return this.http.post(url, nuevoRegistro);
}*/
}
