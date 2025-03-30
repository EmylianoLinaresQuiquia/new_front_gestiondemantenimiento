import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pm1InspectionComponent } from './pm1-inspection.component';

describe('Pm1InspectionComponent', () => {
  let component: Pm1InspectionComponent;
  let fixture: ComponentFixture<Pm1InspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pm1InspectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pm1InspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
