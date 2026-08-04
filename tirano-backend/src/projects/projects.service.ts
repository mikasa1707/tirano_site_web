import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Project } from './entities/project.entity';

import { BaseService } from '../common/services/base.service';

import { PaginationDto } from '../common/dto/pagination.dto';

import { SearchDto } from '../common/dto/search.dto';

import { SortDto } from '../common/dto/sort.dto';

import { ResponseUtil } from '../common/utils/response.util';

import { MediaService } from '../media/media.service';
import { Media } from 'src/media/entities/media.entity';

@Injectable()
export class ProjectsService extends BaseService<Project> {
  constructor(
    @InjectRepository(Project)
    repository: Repository<Project>,

    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,

    private mediaService: MediaService,
  ) {
    super(repository, 'Projet');
  }

  // ===============================
  // FIND ALL PAGINATION SEARCH SORT
  // ===============================

  async findAll(pagination: PaginationDto, search: SearchDto, sort: SortDto) {
    const page = pagination.page ?? 1;

    const limit = pagination.limit ?? 10;

    const query = this.repository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.medias', 'media');

    if (search.search) {
      query.where(
        `
project.title LIKE :search

OR project.description LIKE :search

OR project.client LIKE :search

`,

        {
          search: `%${search.search}%`,
        },
      );
    }

    query.orderBy(
      `project.${sort.sortBy ?? 'created_at'}`,

      sort.sortOrder ?? 'DESC',
    );

    query.skip((page - 1) * limit);

    query.take(limit);

    const [projects, total] = await query.getManyAndCount();

    return ResponseUtil.paginate(
      projects,

      {
        page,

        limit,

        total,

        totalPages: Math.ceil(total / limit),
      },

      'Liste projets',
    );
  }

  // ===============================
  // MEDIA
  // ===============================

  // async addMedia(id: number, file: Express.Multer.File[]) {
  //   const project = await this.findOne(
  //     id,

  //     {
  //       medias: true,
  //     },
  //   );

  //   for (const file of files) {
  //     const media = this.mediaService.create(
  //       file,
  //       {
  //         description: 'Service',
  //       },
  //       'services',
  //     );

  //     const medias: Media[] = [];

  //     media.siteService = service;

  //     const saved = await this.mediaRepository.save(media);

  //     medias.push(saved);
  //   }

  //   return this.mediaService.attach(
  //     file,

  //     'projects',

  //     (media) => {
  //       media.project = project;
  //     },

  //     project.title,
  //   );
  // }

  async addMedia(id: number, files: Express.Multer.File[]) {
    const project = await this.findOne(id);
    const medias: Media[] = [];

    for (const file of files) {
      const media = this.mediaService.create(
        file,
        {
          description: 'Project',
        },
        'projects',
      );

      media.project = project;

      const saved = await this.mediaRepository.save(media);

      medias.push(saved);
    }

    return medias;
  }
}
