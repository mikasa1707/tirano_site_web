import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialListPage } from './testimonial-list-page';

describe('TestimonialListPage', () => {
  let component: TestimonialListPage;
  let fixture: ComponentFixture<TestimonialListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestimonialListPage],
    }).compileComponents();

    fixture = TestBed.createComponent(TestimonialListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
