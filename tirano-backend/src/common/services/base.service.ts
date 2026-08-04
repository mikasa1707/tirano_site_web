import { NotFoundException } from '@nestjs/common';

import {
  Repository,
  DeepPartial,
  ObjectLiteral,
  FindOptionsRelations,
  FindOptionsWhere,
} from 'typeorm';

export abstract class BaseService<T extends ObjectLiteral> {
  constructor(
    protected readonly repository: Repository<T>,
    protected readonly entityName: string,
  ) {}

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);

    return await this.repository.save(entity);
  }

  async findOne(id: number, relations?: FindOptionsRelations<T>): Promise<T> {
    const where = {
      id,
    } as unknown as FindOptionsWhere<T>;

    const entity = await this.repository.findOne({
      where,
      relations,
    });

    if (!entity) {
      throw new NotFoundException(`${this.entityName} introuvable`);
    }

    return entity;
  }

  async update(id: number, data: DeepPartial<T>): Promise<T> {
    const entity = await this.findOne(id);

    Object.assign(entity, data);

    return await this.repository.save(entity);
  }

  async remove(id: number): Promise<T> {
    const entity = await this.findOne(id);

    await this.repository.remove(entity);

    return entity;
  }
}
