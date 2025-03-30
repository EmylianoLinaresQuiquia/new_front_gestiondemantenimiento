import { NgModule } from '@angular/core';
import { CommonModule,registerLocaleData } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Ng-Zorro Ant Design modules
import { NzFormModule } from 'ng-zorro-antd/form';



import es from '@angular/common/locales/es'; // Localización en español para Angular

import { NZ_I18N, es_ES } from 'ng-zorro-antd/i18n'; // Localización en español para Ng-Zorro
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTableModule } from 'ng-zorro-antd/table';  // Importación del módulo de tablas
import { NzDividerModule } from 'ng-zorro-antd/divider'; // Para divisores si se necesita
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

// import { registerAllModules } from 'handsontable/registry'; // Uncomment if needed
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { PdfViewerPm1Component } from './components/pdf-viewer-pm1/pdf-viewer-pm1.component';


import { NzInputGroupComponent } from 'ng-zorro-antd/input';


import { NzTimelineModule } from 'ng-zorro-antd/timeline';
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    PdfViewerPm1Component,
    // Ng-Zorro Ant Design modules
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzAlertModule,
    NzTabsModule,
    NzGridModule,
    NzDropDownModule,
    NzIconModule,
    NzLayoutModule,
    NzToolTipModule,
    NzBadgeModule,
    NzListModule,
    NzAvatarModule,
    NzTagModule,
    NzEmptyModule,
    NzMenuModule,
    NzTableModule, // Agregado para trabajar con tablas
    NzDividerModule, // Agregado por si necesitas divisores
    NzCardModule,
    NzSelectModule,
    NzCollapseModule,
    NzTimePickerModule,
    NzBreadCrumbModule,
    NzStatisticModule,
    NzProgressModule,
    NzTimelineModule,

    NzInputGroupComponent



  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    PdfViewerPm1Component,
    // Ng-Zorro Ant Design modules
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzAlertModule,
    NzTabsModule,
    NzGridModule,
    NzDropDownModule,
    NzIconModule,
    NzLayoutModule,
    NzToolTipModule,
    NzBadgeModule,
    NzListModule,
    NzAvatarModule,
    NzTagModule,
    NzEmptyModule,
    NzMenuModule,
    NzTableModule, // Agregado para trabajar con tablas
    NzDividerModule, // Agregado por si necesitas divisores
    NzCardModule,
    NzSelectModule,
    NzCollapseModule,
    NzTimePickerModule,
    NzBreadCrumbModule,
    NzStatisticModule,
    NzProgressModule,
    NzTimelineModule,

    NzInputGroupComponent


  ],
  providers: [
    NzMessageService,
    { provide: NZ_I18N, useValue: es_ES }, // Configuración de idioma de Ng-Zorro en español
  ]
})
export class SharedModule {
  constructor() {
    registerLocaleData(es); // Registro de localización de Angular
  }
 }
