import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../common/services/base.service';
import { Article } from './entities/article.entity';
import { MediaService } from '../media/media.service';
import { Media } from 'src/media/entities/media.entity';

@Injectable()
export class ArticlesService extends BaseService<Article> {
  constructor(
    @InjectRepository(Article)
    repository: Repository<Article>,

    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,

    private readonly mediaService: MediaService,
  ) {
    super(repository, 'Article');
  }

  async findAll(pagination: any, search: any, sort: any) {
    const page = pagination.page ?? 1;

    const limit = pagination.limit ?? 10;

    const query = this.repository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.medias', 'media');

    if (search.search) {
      query.where(
        `
        article.title LIKE :search
        OR article.content LIKE :search
        OR article.source LIKE :search
        `,
        {
          search: `%${search.search}%`,
        },
      );
    }

    query.orderBy(
      `article.${sort.sortBy ?? 'created_at'}`,
      sort.sortOrder ?? 'DESC',
    );

    query.skip((page - 1) * limit);

    query.take(limit);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async addMedia(id: number, files: Express.Multer.File[]) {
    const article = await this.findOne(id);
    const medias: Media[] = [];
    for (const file of files) {
      const media = this.mediaService.create(
        file,
        {
          description: 'Article',
        },
        'articles',
      );
      media.article = article;
      const saved = await this.mediaRepository.save(media);
      medias.push(saved);
    }
    return medias;
  }
}
