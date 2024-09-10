import { Component,ChangeDetectorRef } from '@angular/core';
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
export class LoginPageComponent {
  validateForm!: FormGroup;
  loading = false;
  tiempoDeEspera = 0;
  intentosFallidos = 0;
  tiempoInicialDeEspera = 60000; // Ejemplo de 1 minuto en milisegundos
  userId!: number;
  subscription = new Subscription();
  correo!: string;
  codigoReset!: string;
  nuevaContrasena!: string;
  reset = false;
  passwordVisible = false;
  selectedIndex = 0;
  loginError = false;

  isSpinning = false;
  mobileLoginError = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usuarioService: UsuarioService,
    private authService: AuthServiceService,
    private messageService: NzMessageService
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      usuario: ['', [Validators.required]],
      contrasena: ['', [Validators.required]]
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
    this.intentarLogin();
  }

  intentarLogin(): void {
    const loginData = {
      usuario: this.validateForm.get('usuario')?.value,
      contrasena: this.validateForm.get('contrasena')?.value
    };
    console.log('Payload enviado:', loginData);
    const loginSubscription = this.usuarioService.login(loginData.usuario, loginData.contrasena).subscribe({
      next: (response) => this.procesarLoginExitoso(response), // Pasa toda la respuesta
      error: (error) => {
        console.error('Error al iniciar sesión:', error);
        this.procesarErrorLogin();
      }
    });


    this.subscription.add(loginSubscription);
  }

  private procesarLoginExitoso(response: any): void {
    this.intentosFallidos = 0;
    this.tiempoDeEspera = 0;
    this.userId = response.idUsuario; // Ahora accedes a response.idUsuario

    // Guardar los datos en localStorage
    localStorage.setItem('userEmail', this.validateForm.get('usuario')?.value);
    localStorage.setItem('userId', response.idUsuario.toString());
    localStorage.setItem('cargo', response.cargo);

    console.log('Email guardado:', localStorage.getItem('userEmail'));
    console.log('ID de usuario guardado:', localStorage.getItem('userId'));
    console.log('Cargo guardado:', localStorage.getItem('cargo'));

    this.loading = false;
    this.abrirHome();
  }


  private procesarErrorLogin(): void {
    this.intentosFallidos++;
    this.loading = false;

    if (this.intentosFallidos >= 3) {
      this.actualizarTiempoDeEspera();
    } else {
      this.mostrarConfirmacion();
    }
  }

  private mostrarTiempoDeEspera(): void {
    const tiempoRestante = ((this.tiempoDeEspera - Date.now()) / 1000).toFixed(0);
    alert(`Por favor, espera ${tiempoRestante} segundos antes de intentar de nuevo.`);
  }

  private actualizarTiempoDeEspera(): void {
    this.tiempoDeEspera = Date.now() + this.tiempoInicialDeEspera * this.intentosFallidos;
    const tiempoEnMinutos = ((this.tiempoInicialDeEspera * this.intentosFallidos) / 60000).toFixed(0);
    alert(`Has superado el número máximo de intentos. Espera ${tiempoEnMinutos} minutos antes de intentar de nuevo.`);
  }

  mostrarConfirmacion(): void {
    this.messageService.warning('Ocurrió un error durante el inicio de sesión. ¿Quieres intentarlo de nuevo?');
  }

  enviarCorreo(): void {
    this.usuarioService.enviarCorreo(this.correo, 'Este es un mensaje de prueba con un número aleatorio.').subscribe({
      next: () => {
        this.messageService.success('Código enviado a su correo');
      },
      error: () => {
        this.messageService.error('Error al enviar el correo');
      }
    });
  }

  validarCodigoUsuario(): void {
    const validacionDto: ValidacionCodigoDTO = {
      correo: this.correo,
      codigo: Number(this.codigoReset) // Convertir a número
    };

    this.usuarioService.validarCodigo(validacionDto).subscribe({
      next: () => {
        this.messageService.info('Código validado con éxito. Procediendo a restablecer contraseña.');
        this.restablecerContrasena();
      },
      error: () => {
        this.messageService.error('Error en la validación del código');
      }
    });
  }

  restablecerContrasena(): void {
    this.usuarioService.restablecerContrasena({ correo: this.correo, nuevaContrasena: this.nuevaContrasena }).subscribe({
      next: () => {
        this.messageService.success('La contraseña ha sido actualizada con éxito');
      },
      error: () => {
        this.messageService.error('Error al restablecer la contraseña');
      }
    });
  }

  abrirHome(): void {
    this.router.navigate(['/dashboard'], {
      queryParams: { userEmail: this.validateForm.get('usuario')?.value, userId: this.userId }
    });
  }

  buscarCorreoPorUsuario(usuario: string): void {
    this.usuarioService.buscarCorreoPorUsuario(usuario).subscribe({
      next: (data) => {
        this.correo = data;
      },
      error: (error) => {
        console.error('Error al buscar el correo:', error);
      }
    });
  }

  onForgotPassword(): void {
    this.selectedIndex = 1;
    //this.buscarCorreoPorUsuario(this.validateForm.get('usuario')?.value);
    //this.reset = true;
  }
  goBack(): void {
    this.selectedIndex = 0; // Regresa a la pestaña de inicio de sesión
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}










