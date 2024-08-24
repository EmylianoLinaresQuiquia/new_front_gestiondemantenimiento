import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routes';

// Importa otros módulos y componentes que hayas creado
import { LayoutsModule } from './layouts/layouts.module';
//import { SharedModule } from './shared/shared.module';
import { DashboardModule } from './features/dashboard/dashboard.module';


import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Importaciones de Ng-Zorro-Antd
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule, NZ_ICONS } from 'ng-zorro-antd/icon';
import { UserOutline, LockOutline } from '@ant-design/icons-angular/icons';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzMenuModule } from 'ng-zorro-antd/menu';





@NgModule({
  declarations: [
    AppComponent,            // Componente raíz de la aplicación



  ],
  imports: [
    BrowserModule,         // Módulo que incluye características necesarias para aplicaciones Angular en navegadores
    RouterModule.forRoot(routes),    // Módulo de enrutamiento para gestionar las rutas de la aplicación
    //SharedModule,
    LayoutsModule,
    DashboardModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzAlertModule,
    NzTabsModule,
    NzGridModule,
    NzDropDownModule,
    NzIconModule,
    NzMessageService,
    NzLayoutModule,
    NzToolTipModule,
    NzBadgeModule,
    NzListModule,
    NzAvatarModule,
    NzTagModule,
    NzEmptyModule,
    NzMenuModule,
  ],
  providers: [{ provide: NZ_ICONS, useValue: [UserOutline, LockOutline] },NzMessageService],
  bootstrap: [AppComponent]  // Componente raíz que Angular inyecta en el index.html
})
export class AppModule { }
