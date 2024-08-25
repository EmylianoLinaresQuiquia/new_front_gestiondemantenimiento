import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
const routes = [
    { path: '', component: DashboardPageComponent }
];
let DashboardRoutingModule = class DashboardRoutingModule {
};
DashboardRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule]
    })
], DashboardRoutingModule);
export { DashboardRoutingModule };
//# sourceMappingURL=dashboard-routing.module.js.map