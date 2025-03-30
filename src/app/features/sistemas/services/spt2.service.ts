
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders , HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { InsertSpt2, MostrarSpt2,MostrarSpt2PorId } from '../interface/spt2';
import { catchError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class Spt2Service {

  // Usa la URL base del entorno y añade la ruta específica del recurso
  private apiUrl = `${environment.apiUrl}/spt2`;

  constructor(private http: HttpClient) { }

  eliminarSpt2(id_spt2: number): Observable<void> {
    const url = `${this.apiUrl}/${id_spt2}`;
    return this.http.delete<void>(url).pipe(
      catchError((error) => {
        console.error('Error al eliminar el registro:', error);
        return throwError(() => new Error('No se pudo eliminar el registro.'));
      })
    );
  }



 // Método para obtener los datos de SPT2 desde la API
 obtenerSpt2(): Observable<MostrarSpt2[]> {
  return this.http.get<MostrarSpt2[]>(`${this.apiUrl}/GetSpt2`)
    .pipe(
      catchError(this.handleError<MostrarSpt2[]>())

    );
}

obtenerSpt2PorId(id: number): Observable<MostrarSpt2PorId> {
  return this.http.get<MostrarSpt2PorId>(`${this.apiUrl}/GetSpt2ById/${id}`)
    .pipe(
      map(response => response), // Si necesitas hacer alguna transformación, hazla aquí
      catchError(this.handleError<MostrarSpt2PorId>('obtenerSpt2PorId'))
    );
}



// Método para obtener una imagen en base64 desde una URL
obtenerImagenBase64(rutaImagen: string): Observable<string> {
  const urlCompleta = `${this.apiUrl}/ObtenerImagenBase64?rutaImagen=${encodeURIComponent(rutaImagen)}`;

  return this.http.get<{ base64: string }>(urlCompleta).pipe(
    map(response => response.base64), // Extraer solo el valor base64 del resultado
    catchError(err => {
      console.error('Error al obtener la imagen en base64', err);
      throw err; // Re-lanzar el error para que sea manejado por el flujo principal
    })
  );
}



// Método para dashboard_metodo_caida_spt2
dashboardCaidaSpt2(tagSubestacion: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/dashboardCaidaSpt2/${tagSubestacion}`);
}

// Método para dashboard_metodo_sujecion_spt2
dashboardSujecionSpt2(tagSubestacion: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/dashboardSujecionSpt2/${tagSubestacion}`);
}

// Método para dashboard_metodo_selectivo_spt2
dashboardSelectivoSpt2(tagSubestacion: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/dashboardSelectivoSpt2/${tagSubestacion}`);
}


insertarSpt2(formData: FormData): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/insert`, formData).pipe(
    map((response) => {
      // Verificar si la respuesta tiene la propiedad 'idSpt2'
      if (response.idSpt2) {
        return response;
      } else {
        throw new Error('La respuesta del servidor no contiene el ID esperado.');
      }
    }),
    catchError(this.handleError<any>('insertarSpt2'))
  );
}

// Manejo de errores
private handleError<T>(operation = 'operation', result?: T) {
  return (error: HttpErrorResponse): Observable<T> => {
    console.error(`${operation} failed: ${error.message}`, error);

    let errorMessage = 'Ha ocurrido un error al guardar los datos.';
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return throwError(() => new Error(errorMessage));
  };
}


}


/*
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

  buscarSpt2PorId(id: number): Observable<Spt2> {
    const url = `${this.apiUrl}/BuscarPorId/${id}`;
    return this.http.get<Spt2>(url).pipe(
      catchError(this.handleError<Spt2>('buscarSpt2PorId'))
    );
  }



  mostrarSpt2Firmados(): Observable<Spt2[]> {
    const url = `${this.apiUrl}/MostrarFirmados`;
    return this.http.get<Spt2[]>(url).pipe(
      catchError(this.handleError<Spt2[]>('mostrarSpt2Firmados'))
    );
  }


  }*/



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

