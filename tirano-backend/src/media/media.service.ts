import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Media } from './entities/media.entity';

import { StorageService } from '../storage/storage.service';

import { CreateMediaDto } from './dto/create-media.dto';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private repository: Repository<Media>,

    private storage: StorageService,
  ) {}

  // =========================
  // CREATE + UPLOAD
  // =========================

  async create(
    file: any,
    dto: CreateMediaDto,
    folder = 'general',
  ) {
    const uploaded = this.storage.upload(file, folder);

    const media = this.repository.create({
      ...uploaded,

      description: dto.description,
    });

    return this.repository.save(media);
  }

  // =========================
  // ATTACH MEDIA TO ENTITY
  // =========================

  async attach(
    file: any,

    folder: string,

    assign: (media: Media) => void,

    description?: string,
  ) {
    const media = await this.create(
      file,

      {
        description,
      },

      folder,
    );

    assign(media);

    return this.repository.save(media);
  }

  // =========================
  // FIND ALL
  // =========================

  async findAll() {
    return this.repository.find({
      order: {
        created_at: 'DESC',
      },
    });
  }

  // =========================
  // FIND ONE
  // =========================

  async findOne(id: number) {
    const media = await this.repository.findOne({
      where: {
        id,
      },
    });

    if (!media) {
      throw new NotFoundException('Média introuvable');
    }

    return media;
  }

  // =========================
  // UPDATE
  // =========================

  async update(
    id: number,

    data: Partial<Media>,
  ) {
    const media = await this.findOne(id);

    Object.assign(media, data);

    return this.repository.save(media);
  }

  // =========================
  // REMOVE
  // =========================

  async remove(id: number) {
    const media = await this.findOne(id);

    this.storage.delete(media.path);

    await this.repository.remove(media);

    return {
      success: true,
      message: 'Média supprimé',
    };
  }
}
