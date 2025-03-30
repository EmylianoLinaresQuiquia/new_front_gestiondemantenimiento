
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InspectionPageComponent } from './pages/inspection-systems/inspection-page.component';
import { HistoryComponent } from './components/history-spt1/history.component';
import { HistorySpt2Component } from './components/history-spt2/history-spt2.component';
import { Spt1InspectionComponent } from './components/spt1-inspection/spt1-inspection.component';
import { Spt2InspectionComponent } from './components/spt2-inspection/spt2-inspection.component';
import { GraphicSpt2Component } from './components/graphic-spt2/graphic-spt2.component';

const routes: Routes = [
  { path: '', component: InspectionPageComponent },
  { path: 'historial-spt1', component: HistoryComponent },
  { path: 'historial-spt2', component: HistorySpt2Component },
  { path: 'grafico-spt2', component: GraphicSpt2Component },
  { path: 'spt1', component: Spt1InspectionComponent },
  { path: 'spt2', component: Spt2InspectionComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InspectionRoutingModule {}
