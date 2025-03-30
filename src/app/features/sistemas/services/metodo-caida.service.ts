import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MetodoCaida } from '../interface/metodo-caida';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MetodoCaidaService {

  private baseUrl = `${environment.apiUrl}/MetodoCaida`;

  constructor(private http: HttpClient) {}

  insertarMetodoCaida(data: any[]): Observable<MetodoCaida> {
    return this.http.post<MetodoCaida>(`${this.baseUrl}/caida`, data).pipe(
      catchError(this.handleError)
    );
  }

  getMetodoCaidaById(id: number): Observable<MetodoCaida[]> {
    return this.http.get<MetodoCaida[]>(`${this.baseUrl}/${id}`);
  }

  mostrarMetodoCaida(): Observable<MetodoCaida[]> {
    return this.http.get<MetodoCaida[]>(`${this.baseUrl}/mostrarMetodoCaida`);
  }

  private handleError(error: any): Observable<never> {
    console.error('Error en el servicio:', error);
    return throwError('Algo salió mal; por favor, intenta más tarde.');
  }
}
