import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';

import { FilesInterceptor } from '@nestjs/platform-express';

import { ArticlesService } from './articles.service';

import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

interface SiteServiceQuery {
  page?: string;
  limit?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

@Controller('articles')
export class ArticlesController {
  constructor(private readonly service: ArticlesService) {}

  @Post()
  create(@Body() dto: CreateArticleDto) {
    return this.service.create(dto);
  }

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
  @UseInterceptors(FilesInterceptor('files', 10))
  addMedia(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.service.addMedia(Number(id), files);
  }
}
