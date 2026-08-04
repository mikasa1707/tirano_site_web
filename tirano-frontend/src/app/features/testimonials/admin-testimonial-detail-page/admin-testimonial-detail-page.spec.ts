import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTestimonialDetailPage } from './admin-testimonial-detail-page';

describe('AdminTestimonialDetailPage', () => {
  let component: AdminTestimonialDetailPage;
  let fixture: ComponentFixture<AdminTestimonialDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTestimonialDetailPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTestimonialDetailPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
