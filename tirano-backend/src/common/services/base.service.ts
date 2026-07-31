import { NotFoundException } from '@nestjs/common';

import {
  Repository,
  DeepPartial,
  ObjectLiteral,
  FindOptionsRelations,
} from 'typeorm';

export abstract class BaseService<T extends ObjectLiteral> {
  constructor(
    protected readonly repository: Repository<T>,
    protected readonly entityName: string,
  ) {}

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);

    return this.repository.save(entity);
  }

  async findOne(id: number, relations?: FindOptionsRelations<T>): Promise<T> {
    const entity = await this.repository.findOne({
      where: {
        id,
      } as any,

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

    return this.repository.save(entity);
  }

  async remove(id: number) {
    const entity = await this.findOne(id);

    await this.repository.remove(entity);

    return {
      success: true,
      message: `${this.entityName} supprimé`,
    };
  }
}
