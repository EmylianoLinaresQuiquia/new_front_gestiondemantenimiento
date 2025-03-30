import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransformerInspectionComponent } from './transformer-inspection.component';

describe('TransformerInspectionComponent', () => {
  let component: TransformerInspectionComponent;
  let fixture: ComponentFixture<TransformerInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransformerInspectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransformerInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
