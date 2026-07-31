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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async findByEmail(email: string) {
    return this.repository.findOne({
      where: {
        email,
      },
    });
  }

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

  async findAll(pagination: PaginationDto, search: SearchDto, sort: SortDto) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const query = this.repository.createQueryBuilder('user');

    if (search.search) {
      query.where(
        `
      user.firstname LIKE :search
      OR user.lastname LIKE :search
      OR user.email LIKE :search
      `,
        {
          search: `%${search.search}%`,
        },
      );
    }

    query
      .orderBy(`user.${sort.sortBy ?? 'created_at'}`, sort.sortOrder ?? 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [users, total] = await query.getManyAndCount();

    return {
      users: users.map((user) => new UserResponseDto(user)),
      total,
      page,
      limit,
    };
  }

  async findOne(id: number) {
    const user = await this.repository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    return new UserResponseDto(user);
  }

  async update(
    id: number,

    dto: UpdateUserDto,
  ) {
    const user = await this.repository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(user, dto);

    const saved = await this.repository.save(user);

    return new UserResponseDto(saved);
  }

  async remove(id: number) {
    const user = await this.repository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    await this.repository.softRemove(user);

    return {
      deleted: true,
    };
  }

  async save(user: User) {
    return this.repository.save(user);
  }

  async findOneEntity(id: number) {
    return this.repository.findOne({
      where: {
        id,
      },
    });
  }
}
