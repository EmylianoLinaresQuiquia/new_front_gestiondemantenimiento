import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransformerSelectComponent } from './transformer-select.component';

describe('TransformerSelectComponent', () => {
  let component: TransformerSelectComponent;
  let fixture: ComponentFixture<TransformerSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransformerSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransformerSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
