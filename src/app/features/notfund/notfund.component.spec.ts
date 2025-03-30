import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotfundComponent } from './notfund.component';

describe('NotfundComponent', () => {
  let component: NotfundComponent;
  let fixture: ComponentFixture<NotfundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotfundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotfundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
