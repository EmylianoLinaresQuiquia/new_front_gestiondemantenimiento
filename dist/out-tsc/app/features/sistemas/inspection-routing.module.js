import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InspectionPageComponent } from './pages/inspection-page/inspection-page.component';
import { HistoryComponent } from './components/history/history.component';
import { Spt1InspectionComponent } from './components/spt1-inspection/spt1-inspection.component';
const routes = [
    { path: '', component: InspectionPageComponent },
    { path: 'historial', component: HistoryComponent },
    { path: 'spt1', component: Spt1InspectionComponent },
    { path: '**', redirectTo: '' }
];
let InspectionRoutingModule = class InspectionRoutingModule {
};
InspectionRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule]
    })
], InspectionRoutingModule);
export { InspectionRoutingModule };
//# sourceMappingURL=inspection-routing.module.js.map