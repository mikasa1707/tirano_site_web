import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { MessagesService } from './messages.service';

import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

import { PaginationDto } from '../common/dto/pagination.dto';
import { SearchDto } from '../common/dto/search.dto';
import { SortDto } from '../common/dto/sort.dto';

import { ResponseUtil } from '../common/utils/response.util';

@Controller('messages')
export class MessagesController {
  constructor(private readonly service: MessagesService) {}

  @Post()
  create(@Body() dto: CreateMessageDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(
    @Query() pagination: PaginationDto,
    @Query() search: SearchDto,
    @Query() sort: SortDto,
  ) {
    return this.service.findAll(pagination, search, sort);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.service.findOne(+id);

    return ResponseUtil.success(data);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateMessageDto) {
    const data = await this.service.update(+id, dto);

    return ResponseUtil.success(data, 'Message modifié');
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(+id);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: number) {
    return this.service.markAsRead(+id);
  }

  @Patch(':id/unread')
  markAsUnread(@Param('id') id: number) {
    return this.service.markAsUnread(+id);
  }
}
