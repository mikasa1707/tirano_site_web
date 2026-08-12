import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { MessagesService } from './messages.service';

import { ResponseUtil } from '../common/utils/response.util';

import { CreateMessageDto } from './dto/create-message.dto';
import { Public } from 'src/auth/decorators/public.decorator';

interface MessageQuery {
  page?: string;

  limit?: string;

  search?: string;

  sortBy?: string;

  sortOrder?: 'ASC' | 'DESC';
}

@Controller('messages')
export class MessagesController {
  constructor(private readonly service: MessagesService) {}

  // =========================================================
  // PUBLIC - CREATE MESSAGE
  // =========================================================
  @Public()
  @Post()
  async create(@Body() dto: CreateMessageDto) {
    const data = await this.service.createMessage(dto);

    return ResponseUtil.success(data, 'Message envoyé avec succès');
  }

  // =========================================================
  // ADMIN - LIST
  // =========================================================

  @Get()
  findAll(@Query() query: MessageQuery) {
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

  // =========================================================
  // ADMIN - DETAIL
  // =========================================================

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.service.findOne(+id);

    return ResponseUtil.success(data);
  }

  // =========================================================
  // ADMIN - MARK READ
  // =========================================================

  @Put(':id/read')
  async read(@Param('id') id: string) {
    const data = await this.service.markAsRead(+id);

    return ResponseUtil.success(data, 'Message marqué comme lu');
  }

  // =========================================================
  // ADMIN - MARK UNREAD
  // =========================================================

  @Put(':id/unread')
  async unread(@Param('id') id: string) {
    const data = await this.service.markAsUnread(+id);

    return ResponseUtil.success(data, 'Message marqué comme non lu');
  }

  // =========================================================
  // ADMIN - DELETE
  // =========================================================

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.service.remove(+id);

    return data;
  }
}
