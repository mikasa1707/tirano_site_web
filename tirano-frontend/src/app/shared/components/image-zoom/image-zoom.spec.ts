import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageZoom } from './image-zoom';

describe('ImageZoom', () => {
  let component: ImageZoom;
  let fixture: ComponentFixture<ImageZoom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageZoom],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageZoom);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
