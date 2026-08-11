import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { TestimonialsService } from './testimonials.service';

import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { Public } from 'src/auth/decorators/public.decorator';

interface SiteServiceQuery {
  page?: string;
  limit?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly service: TestimonialsService) {}

  @Post()
  create(@Body() dto: CreateTestimonialDto) {
    return this.service.create(dto);
  }

  @Public()
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

