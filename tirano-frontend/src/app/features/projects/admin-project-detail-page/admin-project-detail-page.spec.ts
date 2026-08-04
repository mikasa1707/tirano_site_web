import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProjectDetailPage } from './admin-project-detail-page';

describe('AdminProjectDetailPage', () => {
  let component: AdminProjectDetailPage;
  let fixture: ComponentFixture<AdminProjectDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProjectDetailPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminProjectDetailPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
