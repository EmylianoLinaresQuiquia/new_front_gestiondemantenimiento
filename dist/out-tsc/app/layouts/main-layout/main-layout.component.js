import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../features/dashboard/components/header/header.component';
import { SidebarComponent } from '../../features/dashboard/components/sidebar/sidebar.component';
let MainLayoutComponent = class MainLayoutComponent {
};
MainLayoutComponent = __decorate([
    Component({
        selector: 'app-main-layout',
        standalone: true,
        imports: [RouterModule, HeaderComponent, SidebarComponent],
        templateUrl: './main-layout.component.html',
        styleUrl: './main-layout.component.css'
    })
], MainLayoutComponent);
export { MainLayoutComponent };
//# sourceMappingURL=main-layout.component.js.map