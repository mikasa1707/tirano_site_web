import { NotFoundException } from '@nestjs/common';
import {
  Repository,
  DeepPartial,
  ObjectLiteral,
  FindOptionsRelations,
  FindOptionsWhere,
} from 'typeorm';

import { NotificationsService } from '../../notifications/notifications.service';

export abstract class BaseService<T extends ObjectLiteral> {
  constructor(
    protected readonly repository: Repository<T>,
    protected readonly entityName: string,
    protected readonly notifications?: NotificationsService,
  ) {}

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);

    const saved = await this.repository.save(entity);

    this.notifications?.notify({
      type: `${this.entityName.toUpperCase()}_CREATED`,
      data: saved,
    });

    return saved;
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

    const saved = await this.repository.save(entity);

    this.notifications?.notify({
      type: `${this.entityName.toUpperCase()}_UPDATED`,
      data: saved,
    });

    return saved;
  }

  async remove(id: number): Promise<T> {
    const entity = await this.findOne(id);

    await this.repository.remove(entity);

    this.notifications?.notify({
      type: `${this.entityName.toUpperCase()}_DELETED`,
      data: entity,
    });

    return entity;
  }
}
