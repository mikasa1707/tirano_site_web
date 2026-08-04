import { Media } from './media';

export interface Article {
  id: number;

  title: string;

  slug: string;

  content: string;

  excerpt?: string;

  type: ArticleType;

  source?: string;

  publishedAt?: Date;

  active: boolean;

  medias: Media[];

  created_at: Date;

  updated_at: Date;
}

export enum ArticleType {
  NEWS = 'NEWS',
  PRESS = 'PRESS',
  EVENT = 'EVENT',
  ADVERTISEMENT = 'ADVERTISEMENT',
  OTHER = 'OTHER',
}
