import { Media } from './media';

export interface Content {
  id: number;

  title: string;

  slug?: string;

  excerpt?: string;

  content?: string;

  image?: string;

  type: 'ARTICLE' | 'EVENT' | 'PROJECT' | 'PRODUCT';

  createdAt?: string;

  medias?: Media[];
}
