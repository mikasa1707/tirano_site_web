import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { SiteService } from './entities/site-service.entity';

import { BaseService } from '../common/services/base.service';

import { PaginationDto } from '../common/dto/pagination.dto';
import { SearchDto } from '../common/dto/search.dto';
import { SortDto } from '../common/dto/sort.dto';

import { ResponseUtil } from '../common/utils/response.util';

import { MediaService } from '../media/media.service';
import { Media } from 'src/media/entities/media.entity';

@Injectable()
export class SiteServicesService extends BaseService<SiteService> {
  constructor(
    @InjectRepository(SiteService)
    repository: Repository<SiteService>,

    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,

    private mediaService: MediaService,
  ) {
    super(repository, 'Service');
  }

  async findAll(pagination: PaginationDto, search: SearchDto, sort: SortDto) {
    const page = pagination.page ?? 1;

    const limit = pagination.limit ?? 10;

    const query = this.repository

      .createQueryBuilder('service')

      .leftJoinAndSelect('service.medias', 'media');

    if (search.search) {
      query.where(
        `
        service.title LIKE :search
        OR service.description LIKE :search
        `,
        {
          search: `%${search.search}%`,
        },
      );
    }

    query.orderBy(
      `service.${sort.sortBy ?? 'created_at'}`,
      sort.sortOrder ?? 'DESC',
    );

    query.skip((page - 1) * limit);

    query.take(limit);

    const [data, total] = await query.getManyAndCount();

    return ResponseUtil.paginate(
      data,
      {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      'Liste services',
    );
  }

  async findOne(id: number) {
    return super.findOne(id, {
      medias: true,
    });
  }

  async addMedia(id: number, files: Express.Multer.File[]) {
    const service = await this.findOne(id);

    const medias: Media[] = [];

    for (const file of files) {
      const media = this.mediaService.create(
        file,
        {
          description: 'Service',
        },
        'services',
      );

      media.siteService = service;

      const saved = await this.mediaRepository.save(media);

      medias.push(saved);
    }

    return medias;
  }
}
