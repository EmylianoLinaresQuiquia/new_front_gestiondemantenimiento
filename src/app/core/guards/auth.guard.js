"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGuard = void 0;
var authGuard = function (route, state) {
    return true;
};
exports.authGuard = authGuard;
/*
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}
*/
