import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './entities/product.entity';

import { BaseService } from '../common/services/base.service';

import { PaginationDto } from '../common/dto/pagination.dto';
import { SearchDto } from '../common/dto/search.dto';
import { SortDto } from '../common/dto/sort.dto';

import { ResponseUtil } from '../common/utils/response.util';

import { MediaService } from '../media/media.service';
import { ProductResponseDto } from './dto/product-response.dto';
import { Media } from 'src/media/entities/media.entity';

@Injectable()
export class ProductsService extends BaseService<Product> {
  constructor(
    @InjectRepository(Product)
    repository: Repository<Product>,

    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,

    private mediaService: MediaService,
  ) {
    super(repository, 'Produit');
  }

  async findAll(pagination: PaginationDto, search: SearchDto, sort: SortDto) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;

    const query = this.repository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.medias', 'media');

    if (search.search) {
      query.where(
        `
        product.name LIKE :search
        OR product.description LIKE :search
        OR product.reference LIKE :search
      `,
        {
          search: `%${search.search}%`,
        },
      );
    }

    query.orderBy(
      `product.${sort.sortBy ?? 'created_at'}`,
      sort.sortOrder ?? 'DESC',
    );

    query.skip((page - 1) * limit);

    query.take(limit);

    const [products, total] = await query.getManyAndCount();

    return ResponseUtil.paginate(
      products.map((product) => new ProductResponseDto(product)),
      {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      'Liste produits',
    );
  }

  async addMedia(id: number, files: Express.Multer.File[]) {
    const product = await this.findOne(id);
    const medias: Media[] = [];

    for (const file of files) {
      const media = this.mediaService.create(
        file,
        {
          description: 'Product',
        },
        'products',
      );

      media.product = product;

      const saved = await this.mediaRepository.save(media);

      medias.push(saved);
    }

    return medias;
  }
}
