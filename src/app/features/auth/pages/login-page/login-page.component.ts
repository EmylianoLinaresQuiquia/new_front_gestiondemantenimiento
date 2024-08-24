import { Component } from '@angular/core';
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
  validateForm: FormGroup;
  isSpinning = false;
  loginError = false;
  selectedIndex = 0;
  mobileLoginError = false;
  passwordVisible = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private message: NzMessageService
  ) {
    this.validateForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      mobile: ['', [Validators.required, this.matchMobile]],
      mail: ['', [Validators.required]],
      remember: [true]
    });
  }

  ngOnInit() {}

  matchMobile = (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && !control.value.match(/^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/)) {
      return { matchMobile: true };
    }
    return null;
  }
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  selectedChange($event: number) {
    if ($event === 0) {
      const username = this.validateForm.controls['username'].value;
      const password = this.validateForm.controls['password'].value;
      this.validateForm.controls['username'].reset(username);
      this.validateForm.controls['password'].reset(password);
    } else {
      const mobile = this.validateForm.controls['mobile'].value;
      const mail = this.validateForm.controls['mail'].value;
      this.validateForm.controls['mobile'].reset(mobile);
      this.validateForm.controls['mail'].reset(mail);
    }
  }

  submitForm() {
    this.isSpinning = true;
    this.loginError = false;
    for (const i of ['username', 'password']) {
      if (i) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    if (this.validateForm.controls['username'].invalid || this.validateForm.controls['password'].invalid) {
      this.isSpinning = false;
      return;
    }

    setTimeout(() => {
      const username = this.validateForm.controls['username'].value;
      const password = this.validateForm.controls['password'].value;

      if (['admin', 'user'].indexOf(username) !== -1 && 'ng.antd.admin' === password) {
        this.router.navigate(['/']);
        this.message.success('登录成功');
      } else {
        this.loginError = true;
        this.isSpinning = false;
      }
    }, 1000);
  }

  submitFormMobile() {
    this.isSpinning = true;
    this.mobileLoginError = false;
    for (const i of ['mobile', 'mail']) {
      if (i) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    if (this.validateForm.controls['mobile'].invalid || this.validateForm.controls['mail'].invalid) {
      this.isSpinning = false;
      return;
    }

    this.login();
  }

  login() {
    setTimeout(() => {
      const mail = this.validateForm.controls['mail'].value;
      if (mail === '123456') {
        this.router.navigate(['/']);
        this.message.success('登录成功');
      } else {
        this.mobileLoginError = true;
        this.isSpinning = false;
      }
    }, 1000);
  }
  goRegister() {
    this.router.navigate(['/user/register']);
  }
}
