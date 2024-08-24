import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TransformadorNoAi } from '../interface/transformador-no-ai';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransformadorNoAiService {

  private apiUrl = `${environment.apiUrl}/TransformadorNoAi`;

  constructor(private http: HttpClient) { }

  insertarTransformadorNoAi(transformadores: TransformadorNoAi[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/InsertarTransformadorNoAi`, transformadores);
  }

  buscarTransformadorNoAiPorLoteID(loteId: number): Observable<TransformadorNoAi[]> {
    return this.http.get<TransformadorNoAi[]>(`${this.apiUrl}/BuscarTransformadorNoAiPorLoteID/${loteId}`);
  }
}
