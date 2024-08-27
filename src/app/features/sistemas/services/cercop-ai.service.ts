import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CercopAi } from '../interface/cercop-ai';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CercopAiService {

  private apiBaseUrl = `${environment.apiUrl}/CercoPerimetricoAi`;

  constructor(private http: HttpClient) { }

  insertarCercoPerimetricoAi(cercos: CercopAi[]): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/InsertarCercoPerimetricoAi`, cercos).pipe(
      catchError(this.handleError)
    );
  }

  buscarCercoPerimetricoAiPorLoteID(loteId: number): Observable<CercopAi[]> {
    return this.http.get<CercopAi[]>(`${this.apiBaseUrl}/BuscarCercoPerimetricoAiPorLoteID/${loteId}`).pipe(
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
