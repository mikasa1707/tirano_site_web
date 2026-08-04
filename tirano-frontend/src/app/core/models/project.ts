import { Media } from './media';

export interface Project {
  id: number;

  title: string;

  description: string;

  client?: string;

  location?: string;

  realizationDate?: Date;

  active: boolean;

  medias: Media[];

  created_at: Date;

  updated_at: Date;
}
