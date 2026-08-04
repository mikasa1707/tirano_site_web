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
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ResponseUtil } from '../common/utils/response.util';

interface QueryDto {
  page?: string;
  limit?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

@Controller('projects')
export class ProjectsController {
  constructor(private service: ProjectsService) {}

  @Post()
  async create(@Body() dto: CreateProjectDto) {
    const data = await this.service.create(dto);

    return ResponseUtil.success(data, 'Projet créé');
  }

  @Get()
  findAll(@Query() query: QueryDto) {
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

  @Put(':id')
  async update(
    @Param('id') id: number,

    @Body() dto: UpdateProjectDto,
  ) {
    const data = await this.service.update(+id, dto);

    return ResponseUtil.success(data, 'Projet modifié');
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const result = await this.service.remove(+id);

    return result;
  }

  @Post(':id/media')
  @UseInterceptors(FilesInterceptor('files'))
  addMedia(
    @Param('id') id: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.service.addMedia(+id, files);
  }
}
