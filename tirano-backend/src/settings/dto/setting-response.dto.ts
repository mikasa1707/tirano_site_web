import { Setting } from '../entities/setting.entity';

export class SettingResponseDto {
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
  medias: any[];

  constructor(entity: Setting) {
    this.id = entity.id;
    this.siteName = entity.siteName;
    this.description = entity.description;
    this.email = entity.email;
    this.phone = entity.phone;
    this.address = entity.address;
    this.facebook = entity.facebook;
    this.instagram = entity.instagram;
    this.linkedin = entity.linkedin;
    this.youtube = entity.youtube;
    this.maintenance = entity.maintenance;
    this.medias = entity.medias ?? [];
  }
}
