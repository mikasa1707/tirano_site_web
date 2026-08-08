import { Media } from './media';

export interface Setting {
  id: number;
  siteName: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  maintenance: boolean;
  medias?: Media[];
}
