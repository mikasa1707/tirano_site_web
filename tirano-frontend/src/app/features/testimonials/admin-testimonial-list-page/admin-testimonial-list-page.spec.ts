import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTestimonialListPage } from './admin-testimonial-list-page';

describe('AdminTestimonialListPage', () => {
  let component: AdminTestimonialListPage;
  let fixture: ComponentFixture<AdminTestimonialListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTestimonialListPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTestimonialListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
