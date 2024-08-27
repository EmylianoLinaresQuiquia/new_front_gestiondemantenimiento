import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { MetodoSelectivo } from '../interface/metodo-selectivo';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MetodoSelectivoService {

    // Usa la URL base del entorno y añade la ruta específica del recurso
    private baseUrl = `${environment.apiUrl}/MetodoSelectivo`;

    constructor(private http: HttpClient) {}

    insertarMetodoSelectivo(data: any[]): Observable<MetodoSelectivo> {
      return this.http.post<MetodoSelectivo>(`${this.baseUrl}/selectivo`, data).pipe(
        catchError(this.handleError)
      );
    }

    getMetodoSelectivoById(id: number): Observable<MetodoSelectivo[]> {
      return this.http.get<MetodoSelectivo[]>(`${this.baseUrl}/${id}`).pipe(
        catchError(this.handleError)
      );
    }

    private handleError(error: any): Observable<never> {
      console.error('Error en el servicio:', error);
      return throwError('Algo salió mal; por favor, intenta más tarde.');
    }
  }
