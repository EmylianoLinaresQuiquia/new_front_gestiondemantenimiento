import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Reportefotografico } from '../interface/reportefotografico';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportefotograficoService {

  // Usa la URL base del entorno y añade la ruta específica del recurso
  private apiUrl = `${environment.apiUrl}/ReporteFotografico`;

  constructor(private http: HttpClient) { }

  insertarReporteFotografico(formData: FormData): Observable<number> {
    return this.http.post<any>(`${this.apiUrl}/insertar`, formData).pipe(
      map(response => response.id),
      catchError(this.handleError)
    );
  }

  buscarReportePorId(id: number): Observable<Reportefotografico[]> {
    return this.http.get<Reportefotografico[]>(`${this.apiUrl}/buscarPorId/${id}`);
  }

  private handleError(error: any): Observable<never> {
    console.error('Error en el servicio:', error);
    return throwError('Algo salió mal; por favor, intenta más tarde.');
  }
}
