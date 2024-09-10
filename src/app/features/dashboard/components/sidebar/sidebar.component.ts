import { Component } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';
import { ActivatedRoute } from '@angular/router';
import { AuthServiceService } from 'src/app/features/sistemas/services/auth-service.service';
import { DashboardService } from '../../services/dashboard.service';
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
  isCollapsed = false;
  // Información del drawer (sidebar)
  drawerInfo = {
    content: {
      menu: true,
      menuHeader: true
    }
  };

  // Estilo del sitio
  siteStyle = 'light'; // o 'light' según tu lógica



  // Información de navegación
  navigationInfo = {
    menu: true // Según tu lógica
  };

  // Menú de ejemplo
  menuList: MenuItem[] = [
    {
      title: 'Mantenimiento',
      link: '/dashboard',
      icon: 'book',
      children: [
        {
          title: 'Sistemas',
          link: '/sistemas',
          icon: 'book'
        },
        {
          title: 'Transformadores',
          link: '/transformadores',
          icon: 'book'
        }
      ]
    }
  ];

  // Variable para almacenar el correo electrónico del usuario
  userEmail?: string;

  model: { label: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private authService: AuthServiceService,
    public DashboardService: DashboardService
  ) {}

  ngOnInit() {
    // Revisa si el email ya está en localStorage
    this.userEmail = localStorage.getItem('userEmail') || undefined;

    // Verifica si el correo ya está presente en la lista de menú
    const emailExists = this.menuList.some(item => item.title === this.userEmail);

    // Agrega dinámicamente el ítem del menú con el email del usuario si no existe
    if (!emailExists && this.userEmail) {
      this.menuList.unshift({
        title: this.userEmail || 'usuario',
        link: '#',
        icon: 'user'
      });
    }
   }
  changeCollapsed() {
    this.isCollapsed = !this.isCollapsed;
  }
}
