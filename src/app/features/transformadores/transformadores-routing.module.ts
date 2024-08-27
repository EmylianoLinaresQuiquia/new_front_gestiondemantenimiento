import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransformerPageComponent } from './pages/transformer-page/transformer-page.component';
import { HistoryComponent } from '../transformadores/components/history/history.component';
import { TransformerInspectionComponent } from '../transformadores/components/transformer-inspection/transformer-inspection.component';
import { GraphicPm1Component } from '../transformadores/components/graphic-pm1/graphic-pm1.component';
import { Pm1InspectionComponent } from '../transformadores/components/pm1-inspection/pm1-inspection.component';
const routes: Routes = [
  { path: '', component: TransformerPageComponent },
  { path: 'historial-pm1', component: HistoryComponent},
  { path: 'inseccion-pm1', component: TransformerInspectionComponent},
  { path: 'grafico-pm1', component: GraphicPm1Component},
  { path: 'pm1', component: Pm1InspectionComponent},

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransformadoresRoutingModule { }
