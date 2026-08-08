import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Setting } from './entities/setting.entity';

import { UpdateSettingDto } from './dto/update-setting.dto';
import { SettingResponseDto } from './dto/setting-response.dto';
import { MediaService } from '../media/media.service';
import { Media } from 'src/media/entities/media.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private readonly repository: Repository<Setting>,

    private readonly mediaService: MediaService,
  ) {}

  async getSettings() {
    const setting = await this.repository.findOne({
      where: {
        id: 1,
      },
      relations: {
        medias: true,
      },
    });

    if (!setting) {
      throw new NotFoundException('Configuration introuvable');
    }

    return new SettingResponseDto(setting);
  }

  async updateSettings(dto: UpdateSettingDto) {
    const setting = await this.repository.findOne({
      where: {
        id: 1,
      },
    });

    if (!setting) {
      throw new NotFoundException('Configuration introuvable');
    }

    Object.assign(setting, dto);

    const saved = await this.repository.save(setting);

    return new SettingResponseDto(saved);
  }

  async addLogo(file: Express.Multer.File) {
    const setting = await this.repository.findOne({
      where: {
        id: 1,
      },
    });

    if (!setting) {
      throw new NotFoundException('Configuration introuvable');
    }

    return this.mediaService.attach(
      file,
      'settings/logo',
      (media) => {
        media.setting = setting;
        media.description = 'Logo';
      },
      'Logo',
    );
  }

  async addFavicon(file: Express.Multer.File) {
    const setting = await this.repository.findOne({
      where: {
        id: 1,
      },
    });

    if (!setting) {
      throw new NotFoundException('Configuration introuvable');
    }

    return this.mediaService.attach(
      file,
      'settings/favicon',
      (media) => {
        media.setting = setting;
        media.description = 'Favicon';
      },
      'Favicon',
    );
  }

  async addMedia(files: Express.Multer.File[]): Promise<Media[]> {
    const setting = await this.repository.findOne({
      where: {
        id: 1,
      },
    });

    if (!setting) {
      throw new NotFoundException('Configuration introuvable');
    }

    const medias: Media[] = [];

    for (const file of files) {
      const media = this.mediaService.create(
        file,
        {
          description: 'Site setting',
        },
        'settings',
      );

      media.setting = setting;

      const saved = await this.repository.manager.save(Media, media);

      medias.push(saved);
    }

    return medias;
  }
}
