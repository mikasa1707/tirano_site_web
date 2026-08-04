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

import { SiteServicesService } from './site-services.service';
import { CreateSiteServiceDto } from './dto/create-site-service.dto';
import { UpdateSiteServiceDto } from './dto/update-site-service.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ResponseUtil } from 'src/common/utils/response.util';

interface SiteServiceQuery {
  page?: string;
  limit?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

@Controller('site-services')
export class SiteServicesController {
  constructor(private service: SiteServicesService) {}

  @Post()
  async create(@Body() dto: CreateSiteServiceDto) {
    const data = await this.service.create(dto);

    return ResponseUtil.success(data, 'Service créé');
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
  async findOne(@Param('id') id: string) {
    const data = await this.service.findOne(Number(id));

    return ResponseUtil.success(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateSiteServiceDto) {
    const data = await this.service.update(Number(id), dto);

    return ResponseUtil.success(data, 'Service modifié');
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }

  @Post(':id/media')
  @UseInterceptors(FilesInterceptor('files', 10))
  addMedia(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log('SERVICE ID:', id);
    console.log('FILES:', files);
    return this.service.addMedia(Number(id), files);
  }
}
