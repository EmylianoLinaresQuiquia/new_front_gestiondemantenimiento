import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TransformadorPM1 } from '../interface/transformador-pm1';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class TransformadorPM1Service {

  private selectedTransformadorSource = new BehaviorSubject<TransformadorPM1 | null>(null);
  selectedTransformador$ = this.selectedTransformadorSource.asObservable();

  private apiUrl = `${environment.apiUrl}/TransformadoresPM1`;
  // Usa la URL del entorno

  constructor(private http: HttpClient) { }

  selectTransformador(transformador: TransformadorPM1) {
    this.selectedTransformadorSource.next(transformador);
  }

  getTransformadores(): Observable<TransformadorPM1[]> {
    return this.http.get<TransformadorPM1[]>(this.apiUrl);
  }

  getTransformadorById(id: number): Observable<TransformadorPM1> {
    return this.http.get<TransformadorPM1>(`${this.apiUrl}/${id}`);
  }

  addTransformador(transformador: TransformadorPM1): Observable<TransformadorPM1> {
    return this.http.post<TransformadorPM1>(this.apiUrl, transformador);
  }

  searchTransformadores(subestacion: string, transformador: string): Observable<TransformadorPM1[]> {
    let params = new HttpParams();
    params = params.append('subestacion', subestacion);
    params = params.append('transformador', transformador);

    return this.http.get<TransformadorPM1[]>(`${this.apiUrl}/search`, { params });
  }

  buscarTransformadoresporsubestacion(subestacion: string): Observable<TransformadorPM1[]> {
    let params = new HttpParams().append('subestacion', subestacion);

    return this.http.get<TransformadorPM1[]>(`${this.apiUrl}/Subestacion/${subestacion}`, { params });
  }

  getPdf(subestacion: string, transformador: string): Observable<Blob> {
    let params = new HttpParams()
      .set('subestacion', subestacion)
      .set('transformador', transformador);

    return this.http.get(`${this.apiUrl}/GetPdf`, { params, responseType: 'blob' });
  }
}
