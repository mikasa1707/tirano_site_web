import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminServiceDetailPage } from './admin-service-detail-page';

describe('AdminServiceDetailPage', () => {
  let component: AdminServiceDetailPage;
  let fixture: ComponentFixture<AdminServiceDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminServiceDetailPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminServiceDetailPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
