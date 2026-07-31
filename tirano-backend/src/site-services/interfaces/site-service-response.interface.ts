import { Media } from '../../media/entities/media.entity';

export interface SiteServiceResponse {
  id: number;
  title: string;
  description: string;
  shortDescription?: string;
  active: boolean;
  medias?: Media[];
  created_at: Date;
  updated_at: Date;
}
