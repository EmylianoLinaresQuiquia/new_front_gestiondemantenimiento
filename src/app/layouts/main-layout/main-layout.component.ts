import { DashboardService } from './../../features/dashboard/services/dashboard.service';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../features/dashboard/components/header/header.component';
import { SidebarComponent } from '../../features/dashboard/components/sidebar/sidebar.component';
import { SharedModule } from '../../shared/shared.module';
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule, HeaderComponent, SidebarComponent,SharedModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  constructor(
    public DashboardService:DashboardService
  ){}
}
