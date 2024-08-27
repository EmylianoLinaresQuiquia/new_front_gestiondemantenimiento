import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MetodoSelectivoGrafica } from '../interface/metodo-selectivo-grafica';
import { throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MetodoSelectivoGraficaService {

  private baseUrl = `${environment.apiUrl}/MetodoSelectivoGrafica`;

  constructor(private http: HttpClient) { }

  insertarGrafica(formData: FormData): Observable<number> {
    return this.http.post<any>(`${this.baseUrl}/insertar`, formData).pipe(
      map(response => response.id),
      catchError(this.handleError)
    );
  }

  buscarPorId(id: number): Observable<MetodoSelectivoGrafica[]> {
    return this.http.get<MetodoSelectivoGrafica[]>(`${this.baseUrl}/buscar/${id}`);
  }

  private handleError(error: any): Observable<never> {
    console.error('Error en el servicio:', error);
    return throwError('Algo salió mal; por favor, intenta más tarde.');
  }
}
