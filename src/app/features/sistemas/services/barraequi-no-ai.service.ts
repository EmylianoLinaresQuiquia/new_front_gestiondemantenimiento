import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BarraequiNoAi } from '../interface/barraequi-no-ai';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class BarraequiNoAiService {

  private apiBaseUrl = `${environment.apiUrl}/BarraEquipotencialNoAi`;

  constructor(private http: HttpClient) { }

  insertarBarraEquipotencialNoAi(barras: BarraequiNoAi[]): Observable<any> {
    const url = `${this.apiBaseUrl}/InsertarBarraEquipotencialNoAi`;
    return this.http.post(url, barras).pipe(
      catchError(this.handleError)
    );
  }

  buscarBarraEquipotencialPorLoteID(loteId: number): Observable<BarraequiNoAi[]> {
    const url = `${this.apiBaseUrl}/BuscarBarraEquipotencialPorLoteID/${loteId}`;
    return this.http.get<BarraequiNoAi[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
