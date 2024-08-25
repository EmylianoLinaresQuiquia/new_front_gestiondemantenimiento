import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    NgModule({
        declarations: [
            LoginComponent
        ],
        imports: [
            CommonModule,
            RouterModule,
            AuthRoutingModule
        ]
    })
], AuthModule);
export { AuthModule };
//# sourceMappingURL=auth.module.js.map