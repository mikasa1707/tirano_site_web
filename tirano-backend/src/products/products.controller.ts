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

import { ProductsService } from './products.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { PaginationDto } from '../common/dto/pagination.dto';
import { SearchDto } from '../common/dto/search.dto';
import { SortDto } from '../common/dto/sort.dto';
import { ResponseUtil } from 'src/common/utils/response.util';

@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
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
  async update(@Param('id') id: number, @Body() dto: UpdateProductDto) {
    const data = await this.service.update(+id, dto);
    return ResponseUtil.success(data, 'Produit modifié');
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
