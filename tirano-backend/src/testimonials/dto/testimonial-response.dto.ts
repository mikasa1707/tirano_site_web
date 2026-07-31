import { Testimonial } from '../entities/testimonial.entity';

export class TestimonialResponseDto {
  id: number;
  name: string;
  role?: string;
  message: string;
  active: boolean;
  medias: any[];

  constructor(item: Testimonial) {
    this.id = item.id;
    this.name = item.name;
    this.role = item.role;
    this.message = item.message;
    this.active = item.active;
    this.medias = item.medias ?? [];
  }
}
