import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminServiceFormPage } from './admin-service-form-page';

describe('AdminServiceFormPage', () => {
  let component: AdminServiceFormPage;
  let fixture: ComponentFixture<AdminServiceFormPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminServiceFormPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminServiceFormPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
