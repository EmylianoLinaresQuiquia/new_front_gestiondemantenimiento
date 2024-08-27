import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransformerPageComponent } from './pages/transformer-page/transformer-page.component';
import { HistoryComponent } from '../transformadores/components/history/history.component';

const routes: Routes = [
  { path: '', component: TransformerPageComponent },
  { path: 'historial-pm1', component: HistoryComponent},

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransformadoresRoutingModule { }
