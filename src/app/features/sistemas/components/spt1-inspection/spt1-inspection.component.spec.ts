import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Spt1InspectionComponent } from './spt1-inspection.component';

describe('Spt1InspectionComponent', () => {
  let component: Spt1InspectionComponent;
  let fixture: ComponentFixture<Spt1InspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Spt1InspectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Spt1InspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
