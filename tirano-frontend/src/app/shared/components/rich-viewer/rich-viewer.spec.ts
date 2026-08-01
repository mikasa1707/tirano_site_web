import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RichViewer } from './rich-viewer';

describe('RichViewer', () => {
  let component: RichViewer;
  let fixture: ComponentFixture<RichViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RichViewer],
    }).compileComponents();

    fixture = TestBed.createComponent(RichViewer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
