import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Testimonial } from '../models/testimonial';

@Injectable({
  providedIn: 'root',
})
export class TestimonialApi {
  constructor(private api: ApiService) {}

  findAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    return this.api.get<any>('testimonials', params);
  }

  findOne(id: number) {
    return this.api.get<Testimonial>(`testimonials/${id}`);
  }

  create(data: Partial<Testimonial>) {
    return this.api.post<Testimonial>('testimonials', data);
  }

  update(id: number, data: Partial<Testimonial>) {
    return this.api.put<Testimonial>('testimonials', id, data);
  }

  delete(id: number) {
    return this.api.delete(`testimonials/${id}`);
  }
}
