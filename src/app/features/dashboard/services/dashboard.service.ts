import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private _isCollapsed = false;

  constructor() {
    // Detectar cambios en el tamaño de la pantalla
    window.addEventListener('resize', this.checkWindowSize.bind(this));
    this.checkWindowSize(); // Verificar el tamaño inicial de la pantalla
  }

  get isCollapsed(): boolean {
    return this._isCollapsed;
  }

  toggleCollapse(): void {
    this._isCollapsed = !this._isCollapsed;
  }

  setCollapseState(state: boolean): void {
    this._isCollapsed = state;
  }

  // Método para verificar el tamaño de la pantalla
  private checkWindowSize(): void {
    const isMobile = window.innerWidth < 768; // Verifica si la pantalla es menor a 768px
    this.setCollapseState(isMobile); // Colapsa el sidebar si es móvil
  }
}
