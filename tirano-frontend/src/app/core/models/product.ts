import { Media } from './media';

export interface Product {
  id: number;

  name: string;

  reference?: string;

  description?: string;

  active: boolean;

  price: number;

  medias: Media[];

  created_at: Date;

  updated_at: Date;
}
