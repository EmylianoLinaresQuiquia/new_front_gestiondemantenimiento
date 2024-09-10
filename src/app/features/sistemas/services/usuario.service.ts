import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs';
import { Observable, throwError } from 'rxjs';
import { Usuario } from '../interface/usuario';
import { ValidacionCodigoDTO } from '../interface/validacion-codigo-dto';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  // Construye la URL completa para el recurso específico
  private apiUrl = `${environment.apiUrl}/usuario`;

  constructor(private http: HttpClient) {}

  insertarUsuario(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.apiUrl}/insertar`, usuario);
  }

  login(usuario: string, contrasena: string): Observable<any> {
    const loginRequest = {
      usuario: usuario,
      contrasena: contrasena,
    };
    return this.http.post(`${this.apiUrl}/login`, loginRequest)
      .pipe(
        catchError(this.handleError)
      );
  }


  buscarUsuarioPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/buscarPorId/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  buscarUsuarioPorCorreo(usuario: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/buscarPorCorreo`, {
      params: { usuario: usuario }
    }).pipe(
      catchError(this.handleError)
    );
  }

  buscarCorreoPorUsuario(usuario: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/correo/${usuario}`, { responseType: 'text' })
      .pipe(
        catchError(this.handleError)
      );
  }

  buscarUsuarioPorFotocheck(fotocheck: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/buscarPorFotocheck/${fotocheck}`)
      .pipe(catchError(this.handleError));
  }

  getUsers(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}`);
  }

  validarCodigo(validacionDto: ValidacionCodigoDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/validarCodigo`, validacionDto)
      .pipe(
        catchError(this.handleError)
      );
  }

  restablecerContrasena(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/restablecerContrasena`, datos);
  }

  enviarCorreo(para: string, contenido: string) {
    const body = {
      para: para,
      asunto: `Hola ${para} no compartas tu código con los demás`,
      contenido: contenido
    };
    return this.http.post(`${this.apiUrl}/enviar`, body);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error del servidor: ${error.status}, mensaje: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
