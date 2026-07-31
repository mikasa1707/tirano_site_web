import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProjectListPage } from './admin-project-list-page';

describe('AdminProjectListPage', () => {
  let component: AdminProjectListPage;
  let fixture: ComponentFixture<AdminProjectListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProjectListPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminProjectListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
