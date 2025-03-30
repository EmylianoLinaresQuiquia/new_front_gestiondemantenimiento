import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tipostp } from '../interface/tipostp';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipostpService {

  private apiUrl = `${environment.apiUrl}/TipoSpt`;

  constructor(private http: HttpClient) {}

  insertarTipoSpt(tipoSpt: Tipostp): Observable<any> {
    return this.http.post(`${this.apiUrl}`, tipoSpt);
  }

  buscarPorIdTipoSpt(id: number): Observable<Tipostp> {
    return this.http.get<Tipostp>(`${this.apiUrl}/${id}`);
  }
}
