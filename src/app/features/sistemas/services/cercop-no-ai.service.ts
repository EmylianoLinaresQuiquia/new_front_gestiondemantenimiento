import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CercopNoAi } from '../interface/cercop-no-ai';

import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CercopNoAiService {

  private baseUrl = `${environment.apiUrl}/CercoPerimetricoNoAi`;

  constructor(private http: HttpClient) { }

  insertarCercoPerimetricoNoAi(cercos: CercopNoAi[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/InsertarCercoPerimetricoNoAi`, cercos)
      .pipe(
        catchError(this.handleError)
      );
  }

  buscarCercoPerimetricoNoAiPorLoteID(loteId: number): Observable<CercopNoAi[]> {
    return this.http.get<CercopNoAi[]>(`${this.baseUrl}/BuscarCercoPerimetricoNoAiPorLoteID/${loteId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError('Something bad happened; please try again later.');
  }
}
