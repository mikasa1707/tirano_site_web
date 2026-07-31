import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { TestimonialsService } from './testimonials.service';

import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';

import { PaginationDto } from '../common/dto/pagination.dto';
import { SearchDto } from '../common/dto/search.dto';
import { SortDto } from '../common/dto/sort.dto';

@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly service: TestimonialsService) {}

  @Post()
  create(@Body() dto: CreateTestimonialDto) {
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
  findOne(@Param('id') id: number) {
    return this.service.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateTestimonialDto) {
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
