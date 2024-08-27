import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MetodoCaidaGrafica } from '../interface/metodo-caida-grafica';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MetodoCaidaGraficaService {

  private baseUrl = `${environment.apiUrl}/MetodoCaidaGrafica`;

  constructor(private http: HttpClient) { }

  insertarGrafica(formData: FormData): Observable<number> {
    return this.http.post<any>(`${this.baseUrl}/insertar`, formData).pipe(
      map(response => response.id),
      catchError(this.handleError)
    );
  }

  buscarPorId(id: number): Observable<MetodoCaidaGrafica[]> {
    return this.http.get<MetodoCaidaGrafica[]>(`${this.baseUrl}/buscar/${id}`);
  }

  private handleError(error: any): Observable<never> {
    console.error('Error en el servicio:', error);
    return throwError('Algo salió mal; por favor, intenta más tarde.');
  }
}
