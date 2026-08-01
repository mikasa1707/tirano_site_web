import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTestimonialFormPage } from './admin-testimonial-form-page';

describe('AdminTestimonialFormPage', () => {
  let component: AdminTestimonialFormPage;
  let fixture: ComponentFixture<AdminTestimonialFormPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTestimonialFormPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTestimonialFormPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
