import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicSpt2Component } from './graphic-spt2.component';

describe('GraphicSpt2Component', () => {
  let component: GraphicSpt2Component;
  let fixture: ComponentFixture<GraphicSpt2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphicSpt2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphicSpt2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
