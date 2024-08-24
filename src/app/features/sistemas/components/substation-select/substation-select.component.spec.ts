import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstationSelectComponent } from './substation-select.component';

describe('SubstationSelectComponent', () => {
  let component: SubstationSelectComponent;
  let fixture: ComponentFixture<SubstationSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubstationSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubstationSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
