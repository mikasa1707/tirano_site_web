import { TestBed } from '@angular/core/testing';

import { TestimonialApi } from './testimonial-api';

describe('TestimonialApi', () => {
  let service: TestimonialApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestimonialApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
