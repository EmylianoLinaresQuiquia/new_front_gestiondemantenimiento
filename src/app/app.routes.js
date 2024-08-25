"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
var auth_layout_component_1 = require("./layouts/auth-layout/auth-layout.component");
var main_layout_component_1 = require("./layouts/main-layout/main-layout.component");
var auth_guard_1 = require("./core/guards/auth.guard");
exports.routes = [
    {
        path: '',
        redirectTo: 'auth/login',
        pathMatch: 'full',
    },
    {
        path: 'auth',
        component: auth_layout_component_1.AuthLayoutComponent,
        children: [
            {
                path: '',
                loadChildren: function () { return Promise.resolve().then(function () { return require('./features/auth/auth.module'); }).then(function (m) { return m.AuthModule; }); }
            }
        ]
    },
    {
        path: '',
        component: main_layout_component_1.MainLayoutComponent,
        canActivate: [auth_guard_1.authGuard],
        children: [
            {
                path: 'dashboard',
                loadChildren: function () { return Promise.resolve().then(function () { return require('./features/dashboard/dashboard.module'); }).then(function (m) { return m.DashboardModule; }); }
            },
            {
                path: 'sistemas',
                loadChildren: function () { return Promise.resolve().then(function () { return require('./features/sistemas/inspection.module'); }).then(function (m) { return m.InspectionModule; }); }
            },
        ]
    },
    {
        path: '**',
        redirectTo: 'auth/login',
    }
];
