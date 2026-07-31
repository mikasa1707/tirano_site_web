import { PaginationMeta } from '../interfaces/pagination.interface';

export class PaginationUtil {
  static createMeta(
    total: number,
    page: number,
    limit: number,
  ): PaginationMeta {
    return {
      page,

      limit,

      total,

      totalPages: Math.ceil(total / limit),
    };
  }
}
