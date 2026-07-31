import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminServiceListPage } from './admin-service-list-page';

describe('AdminServiceListPage', () => {
  let component: AdminServiceListPage;
  let fixture: ComponentFixture<AdminServiceListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminServiceListPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminServiceListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
