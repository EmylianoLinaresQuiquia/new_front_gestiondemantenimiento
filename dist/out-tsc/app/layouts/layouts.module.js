import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
//import { SharedModule } from '../shared/shared.module';
import { DashboardModule } from '../features/dashboard/dashboard.module';
let LayoutsModule = class LayoutsModule {
};
LayoutsModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            RouterModule,
            //SharedModule,
            DashboardModule
        ],
    })
], LayoutsModule);
export { LayoutsModule };
//# sourceMappingURL=layouts.module.js.map