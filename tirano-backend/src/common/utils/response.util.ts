import { ApiResponse } from '../interfaces/api-response.interface';
import { PaginationMeta } from '../interfaces/pagination.interface';

export class ResponseUtil {
  static success<T>(
    data: T,

    message = 'Success',
  ): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
    };
  }

  static paginate<T>(data: T[], meta: PaginationMeta, message = 'Success') {
    return {
      success: true,
      message,
      data,
      meta,
    };
  }
}
