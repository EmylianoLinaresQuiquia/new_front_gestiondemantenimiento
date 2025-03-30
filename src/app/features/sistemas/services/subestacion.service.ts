import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Subestacion } from '../interface/subestacion';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SubestacionService {

  // Construye la URL completa para el recurso específico
  private apiUrl = `${environment.apiUrl}/subestacion`;
  private subestacionLoadedSource = new Subject<Subestacion>();
  private subestacionData = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {}

  subestacionLoaded = this.subestacionLoadedSource.asObservable();

  emitSubestacionLoaded(subestacion: Subestacion) {
    this.subestacionLoadedSource.next(subestacion);
  }

  getSubestacionPorTag(tag: string): Observable<Subestacion> {
    return this.http.get<Subestacion>(`${this.apiUrl}/${tag}`);
  }

  MostrarPdf(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/GetSubestacionPdf`, {
      responseType: 'blob' // Define que el tipo de respuesta será un Blob (para archivos)
    });
  }

  getTagsSubestaciones(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/tags`);
  }

  setSubestacionData(data: any): void {
    this.subestacionData.next(data);
  }

  MostrarSubestaciones(): Observable<Subestacion[]> {
    return this.http.get<Subestacion[]>(`${this.apiUrl}`);
  }

  getSubestacionData(): BehaviorSubject<any> {
    return this.subestacionData;
  }

  getPdfBySubestacion(subestacion: string): Observable<Blob> {
    let params = new HttpParams().set('subestacion', subestacion);

    return this.http.get(`${this.apiUrl}/GetPdfBySubestacion`, { params, responseType: 'blob' });
  }



  /*
  emitSubestacionLoaded(subestacion: Subestacion) {
    this.subestacionLoadedSource.next(subestacion);
  }

  /*private apiUrl = 'https://appservice-webapp-progideas.azurewebsites.net/api/Subestacion';
  private subestacionLoadedSource = new Subject<Subestacion>();
  private subestacionData = new BehaviorSubject<any>(null);

  subestacionLoaded = this.subestacionLoadedSource.asObservable();

  constructor(private http: HttpClient) {}

  getAllSubestaciones(): Observable<Subestacion[]> {
    return this.http.get<Subestacion[]>(`${this.apiUrl}`);
  }

  getSubestacion(tagSubestacion: string): Observable<Subestacion> {
    return this.http.get<Subestacion>(`${this.apiUrl}/${tagSubestacion}`);
  }

  setSubestacionData(data: any): void {
    this.subestacionData.next(data);
  }

  getSubestacionData(): BehaviorSubject<any> {
    return this.subestacionData;
  }

  /*
  emitSubestacionLoaded(subestacion: Subestacion) {
    this.subestacionLoadedSource.next(subestacion);
  }*/
}
