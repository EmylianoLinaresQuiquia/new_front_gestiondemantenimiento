import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InspectionPageComponent } from './pages/inspection-page/inspection-page.component';
import { HistoryComponent } from './components/history/history.component';
import { Spt1InspectionComponent } from './components/spt1-inspection/spt1-inspection.component';

const routes: Routes = [
  { path: '', component: InspectionPageComponent },
  { path: 'historial', component: HistoryComponent },
  { path: 'spt1', component: Spt1InspectionComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InspectionRoutingModule {}
