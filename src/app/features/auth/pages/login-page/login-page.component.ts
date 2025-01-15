import { Component,ChangeDetectorRef,OnInit,OnDestroy,Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/features/sistemas/services/auth-service.service';
import { UsuarioService } from 'src/app/features/sistemas/services/usuario.service';
import { AlertService } from 'src/app/features/sistemas/services/alert.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']  // Corregido 'styleUrl' a 'styleUrls'
})
export class LoginPageComponent implements OnInit, OnDestroy {
  validateForm!: FormGroup;
  subscription = new Subscription();

  loading = false;
  userId!: number;
  tiempoDeEspera = 0;
  intentosFallidos = 0;
  readonly tiempoInicialDeEspera = 60000; // 1 minuto en milisegundos

  selectedIndex = 0; // Control para pestañas de login y recuperación
  isSpinning = false; // Spinner para carga de datos


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usuarioService: UsuarioService,
    private authService: AuthServiceService,
    private alertService: AlertService
  ) {}

  steps = [
    { id: 1, completed: false, enabled: true, color: 'red' },  // Paso 1: habilitado por defecto
    { id: 2, completed: false, enabled: false, color: 'red' }, // Paso 2: deshabilitado por defecto
  ];
  ngOnInit(): void {
    this.validateForm = this.fb.group({
      usuario: ['', [Validators.required]],
      contrasena: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      codigoReset: ['', [Validators.required]],
      nuevaContrasena: ['', [Validators.required, Validators.minLength(6)]],
    });
  }






  /**
   * Controla el proceso de login, obtiene el correo y maneja el tiempo de espera
   */
  login(): void {
    if (this.loading) return;

    if (this.tiempoDeEspera > Date.now()) {
      this.alertService.warning(
        'Intentos bloqueados',
        `Espera ${(this.tiempoDeEspera - Date.now()) / 1000} segundos.`
      );
      return;
    }

    this.loading = true;
    const { usuario, contrasena } = this.validateForm.value;

    this.usuarioService.buscarCorreoPorUsuario(usuario).subscribe({
      next: (correo) => this.validateForm.get('correo')?.setValue(correo || ''),
      error: () => this.validateForm.get('correo')?.setValue(''),
      complete: () => this.intentarLogin(usuario, contrasena),
    });
  }

  /**
   * Lógica de autenticación
   */
  private intentarLogin(usuario: string, contrasena: string): void {
    this.usuarioService.login(usuario, contrasena).subscribe({
      next: (response) => {
        this.resetLoginState();
        this.handleSuccessfulLogin(response);
      },
      error: (error) => this.handleLoginError(error),
    });
  }

  /**
   * Maneja un inicio de sesión exitoso
   */
  private handleSuccessfulLogin(response: any): void {
    this.userId = response.idUsuario;
    localStorage.setItem('userEmail', this.validateForm.get('usuario')?.value);
    localStorage.setItem('userId', response.idUsuario.toString());
    localStorage.setItem('cargo', response.cargo);

    this.alertService.success(
      'Inicio de sesión exitoso',
      `Bienvenido, ${response.usuario}`
    );
    this.router.navigate(['/dashboard'], {
      queryParams: { userEmail: response.usuario, userId: response.idUsuario },
    });
  }

  /**
   * Maneja los errores de inicio de sesión
   */
  private handleLoginError(error: any): void {
    this.loading = false;
    this.intentosFallidos++;

    // Definimos las claves válidas para el objeto `mensajes`
    const mensajes: { [key: number]: string } = {
      401: 'Usuario o contraseña incorrectos.',
      404: 'Usuario no encontrado.',
    };

    // Garantizamos que `error.status` es una clave válida
    const mensaje = mensajes[error.status] || 'Ocurrió un problema. Inténtelo más tarde.';

    this.alertService.error('Error de autenticación', mensaje);

    if (this.intentosFallidos >= 3) {
      this.tiempoDeEspera = Date.now() + this.tiempoInicialDeEspera;
      this.alertService.warning(
        'Demasiados intentos',
        `Espera ${(this.tiempoInicialDeEspera / 60000).toFixed(0)} minutos.`
      );
    }
  }
  goBack(): void {
    this.selectedIndex= 0;
  }
  onForgotPassword () :void{
    this.selectedIndex= 1;
  }


  completeStep(stepId: number): void {
    const currentStep = this.steps.find(step => step.id === stepId);
    const nextStep = this.steps.find(step => step.id === stepId + 1);

    if (currentStep) {
      currentStep.completed = true;
      currentStep.color = 'green'; // Cambia el color a verde
    }

    if (nextStep) {
      nextStep.enabled = true; // Habilita el siguiente paso
    }
  }
  /**
   * Paso 1: Enviar correo con código de verificación.
   */
  enviarCorreo(): void {
    const correo = this.validateForm.get('correo')?.value;

    if (!correo) {
      this.alertService.warning('Campo vacío', 'Por favor, ingrese su correo.');
      return;
    }

    this.isSpinning = true;
    this.usuarioService.solicitarRecuperacion(correo).subscribe({
      next: () => {
        this.alertService.success(
          'Correo enviado',
          'Se ha enviado un código a su correo.'
        );

        // Marca el primer paso como completado
        this.completeStep(1);
      },
      error: () => {
        this.alertService.error(
          'Error',
          'No se pudo enviar el correo. Inténtelo más tarde.'
        );
      },
      complete: () => {
        this.isSpinning = false;
      },
    });
  }

   /**
   * Paso 2 y 3: Verificar el código de recuperación y cambiar la contraseña.
   */
   restablecerContrasena(): void {
    const codigoReset = this.validateForm.get('codigoReset')?.value;
    const nuevaContrasena = this.validateForm.get('nuevaContrasena')?.value;

    if (!codigoReset || !nuevaContrasena) {
      this.alertService.warning(
        'Campos incompletos',
        'Por favor, complete todos los campos.'
      );
      return;
    }

    this.isSpinning = true;

    this.usuarioService.cambiarContrasena(codigoReset, nuevaContrasena).subscribe({
      next: () => {
        this.alertService.success(
          'Contraseña actualizada',
          'La contraseña ha sido restablecida con éxito.'
        );

        // Marca el segundo paso como completado
        this.completeStep(2);

        this.validateForm.reset(); // Limpia el formulario
      },
      error: () => {
        this.alertService.error(
          'Error',
          'El código ingresado no es válido o no se pudo actualizar la contraseña.'
        );
      },
      complete: () => {
        this.isSpinning = false;
      },
    });
  }


  /**
   * Resetea el estado de la sesión
   */
  private resetLoginState(): void {
    this.loading = false;
    this.intentosFallidos = 0;
    this.tiempoDeEspera = 0;
  }

  /**
   * Limpia las suscripciones al destruir el componente
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
