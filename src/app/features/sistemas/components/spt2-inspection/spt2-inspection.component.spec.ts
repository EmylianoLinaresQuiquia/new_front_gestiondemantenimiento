import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Spt2InspectionComponent } from './spt2-inspection.component';

describe('Spt2InspectionComponent', () => {
  let component: Spt2InspectionComponent;
  let fixture: ComponentFixture<Spt2InspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Spt2InspectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Spt2InspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
