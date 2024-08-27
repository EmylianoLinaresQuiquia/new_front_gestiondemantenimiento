import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BarraequiAi } from '../interface/barraequi-ai';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class BarraequiAiService {

  private apiBaseUrl = `${environment.apiUrl}/BarraEquipotencialAi`;

  constructor(private http: HttpClient) { }

  insertarBarraEquipotencialAi(barras: BarraequiAi[]): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/InsertarBarraEquipotencialAi`, barras)
      .pipe(catchError(this.handleError));
  }

  buscarBarraEquipotencialAiPorLoteID(loteId: number): Observable<BarraequiAi[]> {
    return this.http.get<BarraequiAi[]>(`${this.apiBaseUrl}/BuscarBarraEquipotencialAiPorLoteID/${loteId}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError('Something bad happened; please try again later.');
  }
}
