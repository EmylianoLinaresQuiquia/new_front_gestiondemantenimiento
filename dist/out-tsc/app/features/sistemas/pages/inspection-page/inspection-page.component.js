import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
let InspectionPageComponent = class InspectionPageComponent {
    tagSubestacion = '';
    //subestaciones: Subestacion[] = [];
    tagsSubestaciones = [];
};
InspectionPageComponent = __decorate([
    Component({
        selector: 'app-inspection-page',
        standalone: true,
        imports: [CommonModule, FormsModule, ReactiveFormsModule, NzCardModule],
        templateUrl: './inspection-page.component.html',
        styleUrl: './inspection-page.component.css'
    })
], InspectionPageComponent);
export { InspectionPageComponent };
//# sourceMappingURL=inspection-page.component.js.map