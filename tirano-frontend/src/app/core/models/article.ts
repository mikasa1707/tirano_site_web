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

export const ARTICLE_TYPE_OPTIONS = [
  {
    label: 'Actualité',
    value: 'NEWS',
  },
  {
    label: 'Presse',
    value: 'PRESS',
  },
  {
    label: 'Événement',
    value: 'EVENT',
  },
  {
    label: 'Publicité',
    value: 'ADVERTISEMENT',
  },
  {
    label: 'Autre',
    value: 'OTHER',
  },
];
