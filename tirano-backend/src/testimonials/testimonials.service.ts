import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Testimonial } from './entities/testimonial.entity';
import { BaseService } from '../common/services/base.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { SearchDto } from '../common/dto/search.dto';
import { SortDto } from '../common/dto/sort.dto';
import { ResponseUtil } from '../common/utils/response.util';
import { MediaService } from '../media/media.service';
import { TestimonialResponseDto } from './dto/testimonial-response.dto';

@Injectable()
export class TestimonialsService extends BaseService<Testimonial> {
  constructor(
    @InjectRepository(Testimonial)
    repository: Repository<Testimonial>,

    private mediaService: MediaService,
  ) {
    super(repository, 'Témoignage');
  }

  async findAll(pagination: PaginationDto, search: SearchDto, sort: SortDto) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;

    const query = this.repository
      .createQueryBuilder('testimonial')
      .leftJoinAndSelect('testimonial.medias', 'media');

    if (search.search) {
      query.where(
        `
 testimonial.name LIKE :search
 OR testimonial.role LIKE :search
 OR testimonial.message LIKE :search
`,
        {
          search: `%${search.search}%`,
        },
      );
    }

    query.orderBy(
      `testimonial.${sort.sortBy ?? 'created_at'}`,
      sort.sortOrder ?? 'DESC',
    );

    query.skip((page - 1) * limit);
    query.take(limit);

    const [data, total] = await query.getManyAndCount();

    return ResponseUtil.paginate(
      data.map((item) => new TestimonialResponseDto(item)),
      {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      'Liste témoignages',
    );
  }

  async addMedia(id: number, file: any) {
    const testimonial = await super.findOne(id);

    return this.mediaService.attach(
      file,
      'testimonials',
      (media) => {
        media.testimonial = testimonial;
      },
      testimonial.name,
    );
  }
}
