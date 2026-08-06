import { Controller, Get, Param, Query, Delete, Put } from '@nestjs/common';

import { MessagesService } from './messages.service';

import { ResponseUtil } from '../common/utils/response.util';

interface SiteServiceQuery {
  page?: string;
  limit?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

@Controller('messages')
export class MessagesController {
  constructor(private service: MessagesService) {}

  @Get()
  findAll(@Query() query: SiteServiceQuery) {
    return this.service.findAll(
      {
        page: Number(query.page ?? 1),
        limit: Number(query.limit ?? 10),
      },
      {
        search: query.search ?? '',
      },
      {
        sortBy: query.sortBy ?? 'created_at',
        sortOrder: query.sortOrder ?? 'DESC',
      },
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.service.findOne(+id);

    return ResponseUtil.success(data);
  }

  @Put(':id/read')
  async read(@Param('id') id: number) {
    const data = await this.service.markAsRead(+id);

    return ResponseUtil.success(data, 'Message marqué comme lu');
  }

  @Put(':id/unread')
  async unread(@Param('id') id: number) {
    const data = await this.service.markAsUnread(+id);

    return ResponseUtil.success(data, 'Message marqué comme non lu');
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const data = await this.service.remove(+id);

    return data;
  }
}
