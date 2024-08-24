import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MetodoMedicion } from '../interface/metodo-medicion';
import { map } from 'rxjs';

import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MetodoMedicionService {

  private baseUrl = `${environment.apiUrl}/metodomedicion`;

  constructor(private http: HttpClient) {}

  insertarMetodoMedicion(metodoMedicion: MetodoMedicion): Observable<any> {
    const url = `${this.baseUrl}/InsertarMetodoMedicion`;
    return this.http.post<any>(url, metodoMedicion).pipe(
      map(response => {
        if (response && response.idMetodoMedicion !== undefined) {
          return { insertedId: response.idMetodoMedicion };
        } else {
          throw new Error("La respuesta de la API no contiene 'idMetodoMedicion'");
        }
      })
    );
  }

  buscarPorIdMetodoMedicion(id: number): Observable<MetodoMedicion> {
    const url = `${this.baseUrl}/BuscarPorIdMetodoMedicion/${id}`;
    return this.http.get<MetodoMedicion>(url);
  }
}
