import { Component } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';
interface MenuItem {
  title: string;
  link: string;
  icon: string;
  children?: MenuItem[];
}
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  // Información del drawer (sidebar)
  drawerInfo = {
    content: {
      menu: true,
      menuHeader: true
    }
  };

  // Estilo del sitio
  siteStyle = 'dark'; // o 'light' según tu lógica

  // Estado de colapso del sidebar
  isCollapsed = false;

  // Información de navegación
  navigationInfo = {
    menu: true // Según tu lógica
  };

  // Menú de ejemplo
  menuList: MenuItem[] = [
    {
      title: 'Mantenimiento',
      link: '/Mantenimiento',
      icon: 'book',  // Asegúrate de incluir el icono
      children: [
        {
          title: 'Sistemas',
          link: '/sistemas',
          icon: 'book'  // Asegúrate de incluir el icono
        },
        {
          title: 'Transformadores',
          link: '/Transformadores',
          icon: 'book'  // Asegúrate de incluir el icono

        }
      ]
    },

  ];

  // Método para cambiar el estado colapsado del sidebar
  changeCollapsed() {
    this.isCollapsed = !this.isCollapsed;
  }
}
