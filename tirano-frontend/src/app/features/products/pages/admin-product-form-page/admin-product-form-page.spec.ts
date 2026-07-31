import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductFormPage } from './admin-product-form-page';

describe('AdminProductFormPage', () => {
  let component: AdminProductFormPage;
  let fixture: ComponentFixture<AdminProductFormPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProductFormPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminProductFormPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
