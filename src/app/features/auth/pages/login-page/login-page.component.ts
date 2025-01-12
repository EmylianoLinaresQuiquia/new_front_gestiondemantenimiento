import { Component,ChangeDetectorRef,OnInit,OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// Importación de los módulos de Ng-Zorro-Antd
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/features/sistemas/services/auth-service.service';
import { UsuarioService } from 'src/app/features/sistemas/services/usuario.service';
import { EventEmitter, Output } from '@angular/core';
import { ValidacionCodigoDTO } from 'src/app/features/sistemas/interface/validacion-codigo-dto';
import { AlertService } from 'src/app/features/sistemas/services/alert.service';
@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule,NzDropDownModule, NzFormModule, NzInputModule, NzButtonModule, NzAlertModule, NzTabsModule, NzGridModule,

    NzIconModule
  ],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']  // Corregido 'styleUrl' a 'styleUrls'
})
export class LoginPageComponent implements OnInit, OnDestroy {
  validateForm!: FormGroup;
  loading = false;
  tiempoDeEspera = 0;
  intentosFallidos = 0;
  tiempoInicialDeEspera = 60000; // 1 minuto en milisegundos
  userId!: number;
  subscription = new Subscription();
  correo: string = '';
  codigoReset: string = '';
  nuevaContrasena: string = '';
  reset = false;
  passwordVisible = false;
  selectedIndex = 0;

  isSpinning = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usuarioService: UsuarioService,
    private authService: AuthServiceService,
    private alertService: AlertService // Servicio para mostrar notificaciones
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      usuario: ['', [Validators.required]],
      contrasena: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]]
    });
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  selectedChange(index: number): void {
    this.selectedIndex = index;
  }

  login(): void {
    if (this.loading) return;

    if (this.tiempoDeEspera > Date.now()) {
      this.mostrarTiempoDeEspera();
      return;
    }

    this.loading = true;

    const usuario = this.validateForm.get('usuario')?.value;
    this.obtenerCorreo(usuario); // Llama a la función para obtener el correo
    this.intentarLogin();
  }

  intentarLogin(): void {
    const loginData = {
      usuario: this.validateForm.get('usuario')?.value,
      contrasena: this.validateForm.get('contrasena')?.value
    };

    const loginSubscription = this.usuarioService.login(loginData.usuario, loginData.contrasena).subscribe({
      next: (response) => this.procesarLoginExitoso(response),
      error: (error) => this.procesarErrorLogin(error)
    });

    this.subscription.add(loginSubscription);
  }

  obtenerCorreo(usuario: string): void {
    const correoSubscription = this.usuarioService.buscarCorreoPorUsuario(usuario).subscribe({
      next: (correo) => {
        console.log(`Correo asociado al usuario "${usuario}": ${correo}`);
        this.correo = correo;
      },
      error: (error) => {
        console.error(`Error al obtener el correo del usuario "${usuario}":`, error);
      }
    });

    this.subscription.add(correoSubscription);
  }

  private procesarLoginExitoso(response: any): void {
    this.intentosFallidos = 0;
    this.tiempoDeEspera = 0;
    this.userId = response.idUsuario;

    localStorage.setItem('userEmail', this.validateForm.get('usuario')?.value);
    localStorage.setItem('userId', response.idUsuario.toString());
    localStorage.setItem('cargo', response.cargo);

    this.loading = false;
    this.alertService.success('Inicio de sesión exitoso', `Bienvenido, ${response.usuario}`);
    this.abrirHome();
  }

  private procesarErrorLogin(error: any): void {
    this.intentosFallidos++;
    this.loading = false;

    if (error.status === 401) {
      this.alertService.error('Error de autenticación', 'Usuario o contraseña incorrectos.');
    } else if (error.status === 404) {
      this.alertService.warning('Usuario no encontrado', 'Por favor, verifique su nombre de usuario.');
    } else {
      this.alertService.error('Error inesperado', 'Ocurrió un problema, inténtelo más tarde.');
    }

    if (this.intentosFallidos >= 3) {
      this.actualizarTiempoDeEspera();
    }
  }

  private mostrarTiempoDeEspera(): void {
    const tiempoRestante = ((this.tiempoDeEspera - Date.now()) / 1000).toFixed(0);
    this.alertService.warning('Intentos bloqueados', `Por favor, espera ${tiempoRestante} segundos para intentar de nuevo.`);
  }

  private actualizarTiempoDeEspera(): void {
    this.tiempoDeEspera = Date.now() + this.tiempoInicialDeEspera * this.intentosFallidos;
    const tiempoEnMinutos = ((this.tiempoInicialDeEspera * this.intentosFallidos) / 60000).toFixed(0);
    this.alertService.warning('Bloqueo temporal', `Has excedido el número de intentos. Espera ${tiempoEnMinutos} minutos antes de intentar nuevamente.`);
  }

  enviarCorreo(): void {
    const correo = this.validateForm.get('correo')?.value;
    this.usuarioService.solicitarRecuperacion(correo).subscribe({
      next: () => this.alertService.success('Correo enviado', 'Se ha enviado un código a su correo.'),
      error: () => this.alertService.error('Error al enviar', 'No se pudo enviar el correo. Inténtelo más tarde.')
    });
  }



  restablecerContrasena(): void {
    if (!this.codigoReset || !this.nuevaContrasena) {
      this.alertService.warning('Campos incompletos', 'Por favor, complete todos los campos.');
      return;
    }

    this.isSpinning = true;

    this.usuarioService.cambiarContrasena(this.codigoReset, this.nuevaContrasena).subscribe({
      next: () => {
        this.alertService.success('Contraseña actualizada', 'La contraseña ha sido restablecida con éxito.');
        this.isSpinning = false;
      },
      error: () => {
        this.alertService.error('Error', 'No se pudo actualizar la contraseña.');
        this.isSpinning = false;
      }
    });
  }
  onForgotPassword(): void {
    console.log('Método onForgotPassword ejecutado');
    this.selectedIndex = 1;
  }
  goBack(): void {
    this.selectedIndex = 0; // Regresa a la pestaña de inicio de sesión
  }



  abrirHome(): void {
    this.router.navigate(['/dashboard'], {
      queryParams: { userEmail: this.validateForm.get('usuario')?.value, userId: this.userId }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}









