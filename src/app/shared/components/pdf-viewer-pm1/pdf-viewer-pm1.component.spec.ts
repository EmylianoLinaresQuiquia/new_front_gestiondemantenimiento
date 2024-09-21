import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfViewerPm1Component } from './pdf-viewer-pm1.component';

describe('PdfViewerPm1Component', () => {
  let component: PdfViewerPm1Component;
  let fixture: ComponentFixture<PdfViewerPm1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfViewerPm1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfViewerPm1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
