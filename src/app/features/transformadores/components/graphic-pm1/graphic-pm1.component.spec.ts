import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicPm1Component } from './graphic-pm1.component';

describe('GraphicPm1Component', () => {
  let component: GraphicPm1Component;
  let fixture: ComponentFixture<GraphicPm1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphicPm1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphicPm1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
