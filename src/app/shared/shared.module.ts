import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Ng-Zorro Ant Design modules
import { NzFormModule } from 'ng-zorro-antd/form';

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


import { NzInputModule } from 'ng-zorro-antd/input';


// import { registerAllModules } from 'handsontable/registry'; // Uncomment if needed

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

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



  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

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




  ],
  providers: [
    // Ng-Zorro Ant Design services
    NzMessageService,
  ]
})
export class SharedModule { }
