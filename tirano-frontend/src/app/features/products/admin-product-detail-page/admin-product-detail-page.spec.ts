import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductDetailPage } from './admin-product-detail-page';

describe('AdminProductDetailPage', () => {
  let component: AdminProductDetailPage;
  let fixture: ComponentFixture<AdminProductDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProductDetailPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminProductDetailPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
