import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { ArticlesService } from './articles.service';

import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly service: ArticlesService) {}

  @Post()
  create(@Body() dto: CreateArticleDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() pagination: any, @Query() search: any, @Query() sort: any) {
    return this.service.findAll(pagination, search, sort);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(+id, {
      medias: true,
    });
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateArticleDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(+id);
  }

  @Post(':id/media')
  @UseInterceptors(FileInterceptor('file'))
  addMedia(@Param('id') id: number, @UploadedFile() file: any) {
    return this.service.addMedia(+id, file);
  }
}
