import { Media } from './media';

export interface Testimonial {
  id: number;

  name: string;

  role?: string;

  message: string;

  active: boolean;

  medias: Media[];

  created_at: Date;

  updated_at: Date;
}