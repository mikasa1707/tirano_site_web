import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProjectFormPage } from './admin-project-form-page';

describe('AdminProjectFormPage', () => {
  let component: AdminProjectFormPage;
  let fixture: ComponentFixture<AdminProjectFormPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProjectFormPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminProjectFormPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
