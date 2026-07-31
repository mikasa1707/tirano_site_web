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

import { SiteServicesService } from './site-services.service';
import { CreateSiteServiceDto } from './dto/create-site-service.dto';
import { UpdateSiteServiceDto } from './dto/update-site-service.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseUtil } from 'src/common/utils/response.util';

@Controller('site-services')
export class SiteServicesController {
  constructor(private service: SiteServicesService) {}

  @Post()
  async create(@Body() dto: CreateSiteServiceDto) {
    const data = await this.service.create(dto);

    return ResponseUtil.success(data, 'Service créé');
  }

  @Get()
  findAll(@Query() pagination: any) {
    return this.service.findAll(pagination, pagination, pagination);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.service.findOne(+id);

    return ResponseUtil.success(data);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateSiteServiceDto) {
    const data = await this.service.update(+id, dto);

    return ResponseUtil.success(data, 'Service modifié');
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(+id);
  }

  @Post(':id/media')
  @UseInterceptors(FileInterceptor('file'))
  addMedia(
    @Param('id') id: number,
    @UploadedFile()
    file: any,
  ) {
    return this.service.addMedia(+id, file);
  }
}
