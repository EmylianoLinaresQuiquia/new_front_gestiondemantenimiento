import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransformerPageComponent } from './transformer-page.component';

describe('TransformerPageComponent', () => {
  let component: TransformerPageComponent;
  let fixture: ComponentFixture<TransformerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransformerPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransformerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
