import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorySpt2Component } from './history-spt2.component';

describe('HistorySpt2Component', () => {
  let component: HistorySpt2Component;
  let fixture: ComponentFixture<HistorySpt2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorySpt2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorySpt2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
