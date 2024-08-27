import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
    private _isAuthenticated = false;
  private userEmailSubject = new BehaviorSubject<string>('');
  public userEmail$ = this.userEmailSubject.asObservable();
  private userIdSubject = new BehaviorSubject<number>(0);
  public userId$ = this.userIdSubject.asObservable();

  constructor() {}

  setUserEmail(email: string, idUsuario: number) {
    this.userEmailSubject.next(email);
    this.userIdSubject.next(idUsuario);
  }

  getUserEmail(): string | null {
    return this.userEmailSubject.getValue();
  }

  getUserId(): number | null {
    return this.userIdSubject.getValue();
  }
  logout() {
    // Limpiar los datos del usuario
    this.userEmailSubject.next('');
    this.userIdSubject.next(0);
    this._isAuthenticated = false;

    // Otras tareas de limpieza (ej. remover tokens del almacenamiento local)
    localStorage.removeItem('token'); // Si guardas el token en el localStorage
    sessionStorage.clear(); // Limpiar el sessionStorage si es necesario
  }

/*
  private _isAuthenticated = false;
  private userEmailSubject = new BehaviorSubject<string>('');
  public userEmail$ = this.userEmailSubject.asObservable();



  constructor() {}

  setUserEmail(email: string) {
    this.userEmailSubject.next(email);
  }



  clearUserEmail() {
    this.userEmailSubject.next('');
  }
  isAuthenticated(): boolean {
    return this._isAuthenticated;
  }*/
}
