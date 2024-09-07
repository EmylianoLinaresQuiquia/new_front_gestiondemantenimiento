import { NotificacionService } from './../../../sistemas/services/notificacion.service';
import { Spt2Service } from './../../../sistemas/services/spt2.service';
import { Spt1Service } from './../../../sistemas/services/spt1.service';
import { Component,Input  } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { AuthServiceService } from 'src/app/features/sistemas/services/auth-service.service';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/features/sistemas/services/usuario.service';
import { Notificacion } from 'src/app/features/sistemas/interface/notificacion';
import { Spt2 } from 'src/app/features/sistemas/interface/spt2';
import { Spt1 } from 'src/app/features/sistemas/interface/spt1';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ChangeDetectorRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
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
    providers: [
      NzModalService, // Ensure the service is provided here
    ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  mostrarNotificaciones: boolean = false;
  userId!: number;


  userEmail?: string;


    spt2Firmados: Spt2[] = [];
    itemss!: string[];
    registroExitoso: boolean = false;
    mensajeError: string = '';
    usuarioRegistrado: string = '';
    autenticacionExitosa: boolean = false;
    mensajeErrorAutenticacion: string = '';
    notificaciones: Notificacion[] = [];
    notificacionesfirmadas: Notificacion[] = [];
    notificacionespendientes: Notificacion[] = [];
    spt2List: Spt2[] = [];
    spt2Resumen: { tagSubestacion: string; ot: string }[] = [];
    spt1List: Spt1[] = [];
    spt1Resumen: { tagSubestacion: string; ot: string }[] = [];

    private destroy$ = new Subject<void>(); // Añade esta línea


  constructor(
    private authService:AuthServiceService,
    private router :Router,
    private usuarioService:UsuarioService,
    private Spt1Service : Spt1Service,
    private spt2Service : Spt2Service,
    private notificacionService : NotificacionService,
    private messageService:NzMessageService,
      private notificationService:NzNotificationService,
      private modal: NzModalService
  ){

  }

  ngOnInit(): void {
    // Recuperar la configuración de notificaciones desde localStorage
    const storedNotificaciones = localStorage.getItem('mostrarNotificaciones');
    this.mostrarNotificaciones = storedNotificaciones ? JSON.parse(storedNotificaciones) : false;
    console.log('Mostrar notificaciones desde localStorage:', this.mostrarNotificaciones);

    // Obtener el ID del usuario y determinar si es SUPERVISOR
    this.authService.userId$.subscribe((id) => {
      this.userId = id;
      console.log('ID de usuario obtenido:', this.userId);

      this.usuarioService.buscarUsuarioPorId(this.userId).subscribe({
        next: (usuario) => {
          console.log('Usuario obtenido:', usuario);
          if (usuario.cargo === 'SUPERVISOR') {
            console.log('El usuario es SUPERVISOR, se mostrarán notificaciones');
            this.mostrarNotificaciones = true;
            localStorage.setItem('mostrarNotificaciones', JSON.stringify(true)); // Guardar en localStorage
            this.actualizarConteoNotificaciones(); // Actualiza el número de notificaciones
          } else {
            console.log('El usuario no es SUPERVISOR, no se mostrarán notificaciones');
            this.mostrarNotificaciones = false; // Asegurar que otros roles no vean notificaciones
            localStorage.setItem('mostrarNotificaciones', JSON.stringify(false));
          }
        },
        error: (error) => console.error('Error al buscar el usuario:', error)
      });
    });
    this.cargarNotificaciones();
    this.obtenerNotificacionesFirmadas();
    this.obtenerNotificacionesPendientes();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Método para actualizar el conteo de notificaciones
  actualizarConteoNotificaciones(): void {
    this.bellInfo.total = this.bellInfo.notice + this.bellInfo.message + this.bellInfo.task;
  }

  cargarNotificaciones() {
    this.notificacionService.obtenerNotificaciones()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.notificaciones = data;
          console.log('Notificaciones cargadas:', data);  // Mostrar datos en consola
        },
        error: (e) => console.error('Error al cargar notificaciones:', e)
      });
  }

  obtenerNotificacionesFirmadas() {
    this.notificacionService.obtenerNotificacionesFirmadas(this.userId)
      .subscribe(
        (data: Notificacion[]) => {
          this.notificacionesfirmadas = data;
          console.log('Notificaciones firmadas obtenidas:', data);  // Mostrar datos en consola
        },
        error => {
          console.error('Error al obtener las notificaciones firmadas:', error);
        }
      );
  }

  obtenerNotificacionesPendientes() {
    this.notificacionService.obtenerNotificacionesPendientes(this.userId)
      .subscribe(
        (data: Notificacion[]) => {
          // Mapear notificaciones pendientes a la estructura de `NotificationItem`
          this.noticeList = data.map(notificacion => ({
            type: 'notice',  // Tipo de notificación
            time: this.formatTime(notificacion.fecha),  // Convertir la fecha en un formato amigable
            avatar: 'path/to/avatar.png',  // Puede ser dinámico si tienes avatares personalizados
            desc: `Notificación pendiente con ID: ${notificacion.idnotificacion}`,
            read: notificacion.firmado,  // Suponemos que `firmado` indica si está leída o no
            title: `Notificación ID ${notificacion.idnotificacion}`
          }));

          console.log('Notificaciones pendientes mapeadas:', this.noticeList);
        },
        error => {
          console.error('Error al obtener las notificaciones pendientes:', error);
        }
      );
  }



  actualizarFirma(Notificacion: Notificacion): void {
    console.log("ID de notificación:", Notificacion.idnotificacion);
    console.log("Firmado:", Notificacion.firmado);
    console.log("idspt2", Notificacion.id_spt2)
    console.log("idspt1", Notificacion.id_spt1)

    this.spt2Service.buscarSpt2PorId(Notificacion.id_spt2!).subscribe(
      response => {
        console.log('spt2', response);
        if (response && response.idSpt2 !== undefined) {
          response.firma = true;
          this.spt2Service.actualizarFirma(response.idSpt2, response.firma).subscribe(
            response => {
              console.log('Firma actualizada correctamente:', response);
              Notificacion.firmado = true;
              if (Notificacion.idnotificacion !== undefined) {
                this.notificacionService.actualizarFirmaNotificacion(Notificacion.idnotificacion, Notificacion.firmado).subscribe(
                  response => {
                    console.log('Firma actualizada correctamente:', response);
                    this.notificationService.success('Excelente', 'Firma actualizada correctamente');
                  },
                  error => {
                    console.error('Error al actualizar la firma:', error);
                    this.notificationService.error('Error al Guardar', 'Error al actualizar la firma');
                  }
                );
              } else {
                console.error('ID de notificación no definido.');
              }
            },
            error => {
              console.error('Error al actualizar la firma:', error);
              this.notificationService.error('Error al Guardar', 'Error al actualizar la firma');
            }
          );
        } else {
          console.error('ID de SPT2 no definido.');
        }
      },
      error => {
        console.error('Error al buscar SPT2:', error);
      }
    );


    /*this.Spt1Service.buscarSpt1PorId(Notificacion.id_spt1).subscribe(
        response => {
            response.firma = true;
            this.Spt1Service.actualizarFirma(response.id_spt1, response.firma).subscribe(
                response => {
                    console.log('Firma actualizada correctamente:', response);
                    Notificacion.firmado = true;
                    this.notificacionService.actualizarFirmaNotificacion(Notificacion.idnotificacion, Notificacion.firmado).subscribe(
                        response => {
                            console.log('Firma actualizada correctamente:', Notificacion.idnotificacion, Notificacion.firmado);
                            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Firma actualizada correctamente' });
                            // Aquí puedes realizar alguna acción adicional si es necesario
                        },
                        error => {
                            console.error('Error al actualizar la firma:', error);
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar la firma' });
                        }
                    );
                },
                error => {
                    console.error('Error al actualizar la firma:', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar la firma' });
                }
            );
        },
        error => {
            console.error('spt1', Response);
        }
    );*/
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
  formatTime(fecha?: string): string {
    if (!fecha) {
      return 'Fecha no disponible';  // O un mensaje por defecto
    }
    const date = new Date(fecha);
    const now = new Date();
    const hoursAgo = Math.round((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    return `${hoursAgo} hours ago`;
  }


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
