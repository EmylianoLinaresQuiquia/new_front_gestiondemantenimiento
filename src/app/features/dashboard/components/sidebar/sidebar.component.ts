import { Component } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';
import { ActivatedRoute } from '@angular/router';
import { AuthServiceService } from 'src/app/features/sistemas/services/auth-service.service';
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
      link: '/dashboard',
      icon: 'book',  // Asegúrate de incluir el icono
      children: [
        {
          title: 'Sistemas',
          link: '/sistemas',
          icon: 'book'  // Asegúrate de incluir el icono
        },
        {
          title: 'Transformadores',
          link: '/transformadores',
          icon: 'book'  // Asegúrate de incluir el icono
        }
      ]
    },
  ];

  // Variable para almacenar el correo electrónico del usuario
  userEmail?: string;


  // Modelo para almacenar el label que se mostrará en el HTML
  model: { label: string }[] = [];

  constructor(private route: ActivatedRoute, private authService: AuthServiceService) {}

  ngOnInit() {
    // Suscripción a los queryParams para obtener el userEmail
    this.route.queryParams.subscribe(params => {

      this.userEmail = params['userEmail'] || this.authService.getUserEmail();
      // Actualiza el modelo con el email o un valor por defecto
      this.model = [
        {
          label: this.userEmail || 'usuario'
        }
      ];
    });
  }

  // Método para cambiar el estado colapsado del sidebar
  changeCollapsed() {
    this.isCollapsed = !this.isCollapsed;
  }
}
