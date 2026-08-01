import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductListPage } from './admin-product-list-page';

describe('AdminProductListPage', () => {
  let component: AdminProductListPage;
  let fixture: ComponentFixture<AdminProductListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProductListPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminProductListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
