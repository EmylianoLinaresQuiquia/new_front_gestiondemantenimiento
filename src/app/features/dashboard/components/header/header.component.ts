import { PdfPm1Service } from './../../../sistemas/services/pdf-pm1.service';
import { DashboardService } from './../../services/dashboard.service';
import { NotificacionService } from './../../../sistemas/services/notificacion.service';
import { Spt2Service } from './../../../sistemas/services/spt2.service';
import { Spt1Service } from './../../../sistemas/services/spt1.service';
import { Component,Input,ViewChild,TemplateRef  } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { AuthServiceService } from 'src/app/features/sistemas/services/auth-service.service';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/features/sistemas/services/usuario.service';
import { Notificacion, NotificacionPendiente } from 'src/app/features/sistemas/interface/notificacion';
//import { Spt2 } from 'src/app/features/sistemas/interface/spt2';
import { Spt1 } from 'src/app/features/sistemas/interface/spt1';
import { PdfGeneratorServiceService } from 'src/app/features/sistemas/services/pdf-generator-service.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzModalRef } from 'ng-zorro-antd/modal/modal-ref';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ChangeDetectorRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DomSanitizer, SafeHtml,SafeResourceUrl  } from '@angular/platform-browser';
import { PM1,BuscarPM1PorId } from 'src/app/features/sistemas/interface/pm1';
import { PdfViewerPm1Component } from 'src/app/shared/components/pdf-viewer-pm1/pdf-viewer-pm1.component';
import { PM1Service } from 'src/app/features/sistemas/services/pm1.service';
import { PdfGeneratorServicespt1Service } from 'src/app/features/sistemas/services/pdf-generator-servicespt1.service'
interface NotificationItem {
  id:number,
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


    //spt2Firmados: Spt2[] = [];
    itemss!: string[];
    registroExitoso: boolean = false;
    mensajeError: string = '';
    usuarioRegistrado: string = '';
    autenticacionExitosa: boolean = false;
    mensajeErrorAutenticacion: string = '';
    notificaciones: Notificacion[] = [];
    notificacionesfirmadas: Notificacion[] = [];
    notificacionespendientes: Notificacion[] = [];
    //spt2List: Spt2[] = [];
    spt2Resumen: { tagSubestacion: string; ot: string }[] = [];
    spt1List: Spt1[] = [];
    spt1Resumen: { tagSubestacion: string; ot: string }[] = [];

    private destroy$ = new Subject<void>(); // Añade esta línea

    @ViewChild('pdfModal', { static: true }) pdfModal!: TemplateRef<any>;
    pdfUrl: SafeResourceUrl | null = null;
    @ViewChild('pdfViewerPm1') pdfViewerPm1Component!: PdfViewerPm1Component;


    //pdfUrl: SafeResourceUrl | null = null;
  //@ViewChild('pdfModal', { static: false }) pdfModal!: TemplateRef<any>;
  pm1: BuscarPM1PorId | undefined;
  constructor(
    private authService:AuthServiceService,
    private router :Router,
    private usuarioService:UsuarioService,
    private Spt1Service : Spt1Service,
    private spt2Service : Spt2Service,
    private notificacionService : NotificacionService,
    private messageService:NzMessageService,
      private notificationService:NzNotificationService,
      private modal: NzModalService,
      public DashboardService : DashboardService,
      private pdfGeneratorService:PdfGeneratorServiceService,
      private sanitizer: DomSanitizer,
      private pm1Service: PM1Service,
      private Pdfspt1service :PdfGeneratorServicespt1Service,
      private PdfPm1Service:PdfPm1Service
  ){

  }
  toggleSidebar() {
    this.DashboardService.toggleCollapse(); // Utiliza el servicio para cambiar el estado
  }

  ngOnInit(): void {

    // Recuperar la configuración de notificaciones desde localStorage
    const storedNotificaciones = localStorage.getItem('mostrarNotificaciones');
    this.mostrarNotificaciones = storedNotificaciones ? JSON.parse(storedNotificaciones) : false;
    console.log('Mostrar notificaciones desde localStorage:', this.mostrarNotificaciones);

    // Recuperar el cargo del usuario desde localStorage
    const storedCargo = localStorage.getItem('cargo');
    if (storedCargo) {
      if (storedCargo === 'SUPERVISOR') {
        this.mostrarNotificaciones = true;
        console.log('El usuario en localStorage es SUPERVISOR, se mostrarán notificaciones');
      } else {
        this.mostrarNotificaciones = false;
        console.log('El usuario en localStorage no es SUPERVISOR, no se mostrarán notificaciones');
      }
    }

    // Obtener el ID del usuario y determinar el cargo si no está en localStorage
    this.authService.userId$.subscribe((id) => {
      this.userId = id;
      console.log('ID de usuario obtenido:', this.userId);

      // Solo hacer la llamada si no tenemos el cargo en localStorage
      if (!storedCargo) {
        this.usuarioService.buscarUsuarioPorId(this.userId).subscribe({
          next: (usuario) => {
            console.log('Usuario obtenido:', usuario);
            if (usuario.cargo === 'SUPERVISOR') {
              console.log('El usuario es SUPERVISOR, se mostrarán notificaciones');
              this.mostrarNotificaciones = true;
              localStorage.setItem('cargo', 'SUPERVISOR');
              localStorage.setItem('mostrarNotificaciones', JSON.stringify(true)); // Guardar en localStorage
              this.actualizarConteoNotificaciones(); // Actualiza el número de notificaciones
            } else {
              console.log('El usuario no es SUPERVISOR, no se mostrarán notificaciones');
              this.mostrarNotificaciones = false;
              localStorage.setItem('cargo', usuario.cargo); // Guardar el cargo en localStorage
              localStorage.setItem('mostrarNotificaciones', JSON.stringify(false)); // Guardar en localStorage
            }
          },
          error: (error) => console.error('Error al buscar el usuario:', error)
        });
      }
    });

    // Cargar otras notificaciones


     // Recuperar el ID de usuario desde localStorage
     const storedUserId = localStorage.getItem('userId');
     if (storedUserId) {
       this.userId = parseInt(storedUserId, 10);
       console.log('ID de usuario obtenido desde localStorage:', this.userId);
       this.obtenerNotificacionesPendientes(); // Llamada al método
       this.obtenerNotificacionesFirmadas();
     } else {
       this.authService.userId$.subscribe((id) => {
         this.userId = id;
         console.log('ID de usuario obtenido desde observable:', this.userId);
         this.obtenerNotificacionesPendientes(); // Llamada al método
         this.obtenerNotificacionesFirmadas()
       });
     }


  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Método para actualizar el conteo de notificaciones
  actualizarConteoNotificaciones(): void {
    this.bellInfo.total = this.bellInfo.notice + this.bellInfo.message + this.bellInfo.task;
  }



  obtenerNotificacionesFirmadas() {
    this.notificacionService.obtenerNotificacionesFirmadas(this.userId)
      .subscribe(
        (data: NotificacionPendiente[]) => {
          // Mapear las notificaciones firmadas para ajustar el formato y asignarlas a messageList
          this.FirmadoList = data.map(notificacion => {
            const fecha = notificacion.fecha ? new Date(notificacion.fecha).toLocaleString() : 'Fecha no disponible';

            return {
              type: 'notice',
              id_pm1:notificacion.id_pm1,
              id_spt1:notificacion.id_spt1,
              id_spt2:notificacion.id_spt2,
              id:notificacion.idnotificacion,
              time: fecha,
              avatar: 'path/to/avatar.png', // Puedes usar una URL dinámica si tienes un campo de avatar
              read: notificacion.firmado,
              tag_subestacion: notificacion.tag_subestacion,  // Agregar tag_subestacion
              ot: notificacion.ot , // Agregar ot
              desc: 'Descripción no disponible' ,
              title: `${notificacion.nombre_lider}`,

            } as NotificationItem;
          });

          // Actualiza la cantidad de mensajes firmados pendientes
          this.bellInfo.notice = this.FirmadoList.length;


          console.log('Notificaciones firmadas obtenidas:', this.FirmadoList);  // Mostrar datos en consola
        },
        error => {
          console.error('Error al obtener las notificaciones firmadas:', error);
        }
      );
  }

  obtenerNotificacionesPendientes() {
    this.notificacionService.obtenerNotificacionesPendientes(this.userId)
      .subscribe(
        (data: NotificacionPendiente[]) => {
          console.log("data",data)
          this.noticeList = data.map(notificacion => {
            const fecha = notificacion.fecha ? new Date(notificacion.fecha).toLocaleString() : 'Fecha no disponible';

            return {
              type: 'notice',
              id_pm1:notificacion.id_pm1,
              id_spt1:notificacion.id_spt1,
              id_spt2:notificacion.id_spt2,
              id:notificacion.idnotificacion,
              time: fecha,
              avatar: 'path/to/avatar.png',  // Puedes usar una URL dinámica si tienes un campo de avatar
              read: notificacion.firmado,
              title: `${notificacion.nombre_lider}`,
              tag_subestacion: notificacion.tag_subestacion,  // Agregar tag_subestacion
              ot: notificacion.ot , // Agregar ot
              desc: 'Descripción no disponible' ,
            } as NotificationItem;
          });

          // Actualiza bellInfo.notice con la cantidad de notificaciones pendientes
          this.bellInfo.notice = this.noticeList.length;

          console.log('Notificaciones pendientes', this.noticeList);
          console.log('this.userId en pendiente', this.userId);
        },
        error => {
          console.error('Error al obtener las notificaciones pendientes:', error);
        }
      );
  }


  firmarNotificacion(item: NotificationItem): void {
    const idNotificacion = item.id; // Asegúrate de tener el `id` de la notificación
    const firmado = true;

    this.notificacionService.actualizarFirmaNotificacion(idNotificacion, firmado).subscribe(
      (response) => {
        console.log('Notificación firmada con éxito:', response);

        // Actualizar el estado de la notificación y moverla a la lista de firmadas
        this.noticeList = this.noticeList.filter(notice => notice.id !== item.id);
        item.read = true; // Marcar como leído

        // Agregar la notificación firmada a FirmadoList
        this.FirmadoList.push(item);

        // Actualizar la cantidad de notificaciones pendientes y firmadas
        this.bellInfo.notice = this.noticeList.length;
        this.bellInfo.total = this.bellInfo.notice + this.bellInfo.message + this.bellInfo.task;
      },
      (error) => {
        console.error('Error al firmar la notificación:', error);
      }
    );
  }


  eliminarNotificacion(item: NotificationItem): void {
    const idNotificacion = item.id;

    this.notificacionService.eliminarNotificacion(idNotificacion).subscribe(
      (response) => {
        console.log('Notificación eliminada con éxito:', response);

        // Eliminar la notificación de la lista de pendientes
        this.noticeList = this.noticeList.filter(notice => notice.id !== item.id);

        // Actualizar la cantidad de notificaciones pendientes
        this.bellInfo.notice = this.noticeList.length;
        this.bellInfo.total = this.bellInfo.notice + this.bellInfo.message + this.bellInfo.task;
      },
      (error) => {
        console.error('Error al eliminar la notificación:', error);
      }
    );
  }



/*
spt2pdf(tag_subestacion: string, ot: string): void {
  console.log("tag y ot pdf",tag_subestacion,ot)
  this.pdfGeneratorService.generarPDF(tag_subestacion, ot).then((pdfBlob: Blob) => {
    const pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      URL.createObjectURL(pdfBlob) + '#toolbar=0'
    );
    this.pdfUrl = pdfUrl;
    console.log('PDF URL:', pdfUrl);
    this.modal.create({
      //nzTitle: 'PDF Document',
      nzContent: this.pdfModal,
      nzFooter: null,
      nzWidth: 1200
    });
    console.log('Modal abierto con éxito');
  }).catch(error => {
    console.error('Error opening PDF:', error);
  });
}*/



pm1pdf(id_pm1: number): void {
  console.log("enviando id_pm1",id_pm1)
  this.PdfPm1Service.fillPdf(id_pm1).then((pdfBlob: Blob | undefined) => {
    if (pdfBlob) {
      const pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        URL.createObjectURL(pdfBlob) + '#toolbar=0'
      );
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, '_blank');
    } else {
      console.error('No se pudo generar el PDF.');
    }
  }).catch(error => {
    console.error('Error al abrir el PDF:', error);
  });

}


spt1pdf(id_spt1: number): void {
  this.Pdfspt1service.generarPDF(id_spt1).then((pdfBlob: Blob) => {
    const pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      URL.createObjectURL(pdfBlob) + '#toolbar=0'  // Opcional: Oculta la barra de herramientas del visor PDF
    );

    // Abre el PDF en una nueva pestaña
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, '_blank');  // Abre en una nueva pestaña
  }).catch(error => {
    console.error('Error al abrir el PDF:', error);
  });
}





  drawerInfo = {
    content: {
      header: true // Puedes ajustar esto según tu lógica
    }
  };
  noticeList: NotificationItem[] = [
    {
      id:0,
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


  FirmadoList: NotificationItem[] = [
    {
      id:0,
      type: 'notice',
      time: '2 hours ago',
      avatar: 'path/to/avatar.png',
      desc: 'You have a new notice',
      read: false,
      title: 'New Notice'
    }
  ];



  navigationInfo = {
    header: true // o false dependiendo de tu lógica
  };

  siteStyle = 'dark'; // o 'light' dependiendo de tu lógica

  isCollapsed = false; // o true dependiendo de tu lógica

  bellInfo = {
    total: 5, // ejemplo de conteo de notificaciones
    notice: 0, // ejemplo de notificaciones
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
