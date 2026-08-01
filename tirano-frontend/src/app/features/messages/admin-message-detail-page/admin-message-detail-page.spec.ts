import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMessageDetailPage } from './admin-message-detail-page';

describe('AdminMessageDetailPage', () => {
  let component: AdminMessageDetailPage;
  let fixture: ComponentFixture<AdminMessageDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMessageDetailPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminMessageDetailPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
