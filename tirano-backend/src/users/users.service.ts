import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { SearchDto } from '../common/dto/search.dto';
import { SortDto } from '../common/dto/sort.dto';
import { ResponseUtil } from '../common/utils/response.util';
import { Media } from '../media/entities/media.entity';
import { MediaService } from '../media/media.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,

    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,

    private readonly mediaService: MediaService,
  ) {}

  // ============================
  // FIND EMAIL
  // ============================

  async findByEmail(email: string) {
    return this.repository.findOne({
      where: {
        email,
      },
    });
  }

  // ============================
  // CREATE
  // ============================

  async create(dto: CreateUserDto) {
    const exist = await this.findByEmail(dto.email);

    if (exist) {
      throw new ConflictException('Email déjà utilisé');
    }

    const user = this.repository.create({
      ...dto,

      password: await bcrypt.hash(dto.password, 10),
    });

    const saved = await this.repository.save(user);

    return new UserResponseDto(saved);
  }

  // ============================
  // LIST
  // ============================

  async findAll(pagination: PaginationDto, search: SearchDto, sort: SortDto) {
    const page = pagination.page ?? 1;

    const limit = pagination.limit ?? 10;

    const query = this.repository
      .createQueryBuilder('user')

      .leftJoinAndSelect('user.medias', 'media');

    if (search.search) {
      query.where(
        `

user.firstName LIKE :search

OR user.lastName LIKE :search

OR user.email LIKE :search

`,
        {
          search: `%${search.search}%`,
        },
      );
    }

    query.orderBy(
      `user.${sort.sortBy ?? 'created_at'}`,

      sort.sortOrder ?? 'DESC',
    );

    query.skip((page - 1) * limit);

    query.take(limit);

    const [users, total] = await query.getManyAndCount();

    return ResponseUtil.paginate(
      users.map((user) => new UserResponseDto(user)),

      {
        page,

        limit,

        total,

        totalPages: Math.ceil(total / limit),
      },

      'Liste utilisateurs',
    );
  }

  // ============================
  // ENTITY
  // ============================

  async findOneEntity(id: number) {
    const user = await this.repository.findOne({
      where: {
        id,
      },

      relations: {
        medias: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    return user;
  }

  // ============================
  // DETAIL
  // ============================

  async findOne(id: number) {
    const user = await this.findOneEntity(id);

    return new UserResponseDto(user);
  }

  // ============================
  // UPDATE
  // ============================

  async update(
    id: number,

    dto: UpdateUserDto,
  ) {
    const user = await this.findOneEntity(id);

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(user, dto);

    const saved = await this.repository.save(user);

    return new UserResponseDto(saved);
  }

  // ============================
  // DELETE
  // ============================

  async remove(id: number) {
    const user = await this.findOneEntity(id);

    await this.repository.softRemove(user);

    return {
      deleted: true,
    };
  }

  // ============================
  // MEDIA
  // ============================

  async addMedia(
    id: number,

    files: Express.Multer.File[],
  ) {
    const user = await this.findOneEntity(id);

    const medias: Media[] = [];

    for (const file of files) {
      const media = this.mediaService.create(
        file,

        {
          description: 'User',
        },

        'users',
      );

      media.user = user;

      const saved = await this.mediaRepository.save(media);

      medias.push(saved);
    }

    return medias;
  }

  // ============================
  // SAVE
  // ============================

  async save(user: User) {
    return this.repository.save(user);
  }
}
