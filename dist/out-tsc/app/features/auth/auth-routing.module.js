import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ForgotPasswordPageComponent } from './pages/forgot-password-page/forgot-password-page.component';
const routes = [
    { path: 'login', component: LoginPageComponent },
    { path: 'forgot-password', component: ForgotPasswordPageComponent },
    { path: '**', redirectTo: 'login' } // Redirigir a login si la ruta no existe dentro de auth
    /*
    { path: 'login', component: LoginPageComponent },
    { path: 'forgot-password', component: ForgotPasswordPageComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' }*/
];
let AuthRoutingModule = class AuthRoutingModule {
};
AuthRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule]
    })
], AuthRoutingModule);
export { AuthRoutingModule };
//# sourceMappingURL=auth-routing.module.js.map