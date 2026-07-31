import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Setting } from './entities/setting.entity';

import { UpdateSettingDto } from './dto/update-setting.dto';
import { SettingResponseDto } from './dto/setting-response.dto';

import { ResponseUtil } from '../common/utils/response.util';
import { MediaService } from '../media/media.service';

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

  async addLogo(file: any) {
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

  async addFavicon(file: any) {
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
}
