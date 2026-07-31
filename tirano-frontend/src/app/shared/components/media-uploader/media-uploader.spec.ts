import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaUploader } from './media-uploader';

describe('MediaUploader', () => {
  let component: MediaUploader;
  let fixture: ComponentFixture<MediaUploader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaUploader],
    }).compileComponents();

    fixture = TestBed.createComponent(MediaUploader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
