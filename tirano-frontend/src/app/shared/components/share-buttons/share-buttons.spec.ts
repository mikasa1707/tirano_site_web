import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareButtons } from './share-buttons';

describe('ShareButtons', () => {
  let component: ShareButtons;
  let fixture: ComponentFixture<ShareButtons>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareButtons],
    }).compileComponents();

    fixture = TestBed.createComponent(ShareButtons);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
