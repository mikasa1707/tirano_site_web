import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryViewer } from './gallery-viewer';

describe('GalleryViewer', () => {
  let component: GalleryViewer;
  let fixture: ComponentFixture<GalleryViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryViewer],
    }).compileComponents();

    fixture = TestBed.createComponent(GalleryViewer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
