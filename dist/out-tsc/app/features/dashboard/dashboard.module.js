import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
let DashboardModule = class DashboardModule {
};
DashboardModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            DashboardRoutingModule,
            HeaderComponent,
            SidebarComponent
        ],
        exports: [
            HeaderComponent,
            SidebarComponent
        ]
    })
], DashboardModule);
export { DashboardModule };
//# sourceMappingURL=dashboard.module.js.map