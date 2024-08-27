import { Component,Input  } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { AuthServiceService } from 'src/app/features/sistemas/services/auth-service.service';
import { Router } from '@angular/router';
interface NotificationItem {
  type: string;
  time: string;
  avatar: string;
  desc: string;
  read: boolean;
  title: string;
}


@Component({
  selector: 'app-header',
  standalone: true,
  imports:
  [SharedModule
    ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(
    private authService:AuthServiceService,
    private router :Router
  ){

  }
  drawerInfo = {
    content: {
      header: true // Puedes ajustar esto según tu lógica
    }
  };
  noticeList: NotificationItem[] = [
    {
      type: 'notice',
      time: '2 hours ago',
      avatar: 'path/to/avatar.png',
      desc: 'You have a new notice',
      read: false,
      title: 'New Notice'
    }
  ];

  messageList: NotificationItem[] = [
    {
      type: 'message',
      time: '3 hours ago',
      avatar: 'path/to/avatar3.png',
      desc: 'You have a new message',
      read: false,
      title: 'New Message'
    }
  ];

  taskList: NotificationItem[] = [
    {
      type: 'task',
      time: '5 hours ago',
      avatar: 'path/to/avatar4.png',
      desc: 'A new task has been assigned',
      read: false,
      title: 'New Task'
    }
  ];

  navigationInfo = {
    header: true // o false dependiendo de tu lógica
  };

  siteStyle = 'dark'; // o 'light' dependiendo de tu lógica

  isCollapsed = false; // o true dependiendo de tu lógica

  bellInfo = {
    total: 5, // ejemplo de conteo de notificaciones
    notice: 2, // ejemplo de notificaciones
    message: 3, // ejemplo de mensajes
    task: 1 // ejemplo de tareas
  };



  // Métodos de ejemplo
  read(item: any) {
    // Implementa tu lógica aquí
  }

  readAll(type: string) {
    // Implementa tu lógica aquí
  }

  readMore(type: string) {
    // Implementa tu lógica aquí
  }

  goUrl(url: string) {
    // Implementa tu lógica aquí
  }
  logout() {
    this.authService.logout(); // Asegúrate de que AuthService tenga un método logout
    this.router.navigate(['']); // Redirige al usuario a la página de inicio de sesión
  }

  // Ejemplo de menú de lenguaje (ng-zorro dropdown)
  menuLanguage = null; // Esto debería ser una referencia a un menú drop
}
