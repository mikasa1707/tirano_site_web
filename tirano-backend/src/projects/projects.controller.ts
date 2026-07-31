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
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { SearchDto } from '../common/dto/search.dto';
import { SortDto } from '../common/dto/sort.dto';
import { ResponseUtil } from '../common/utils/response.util';

@Controller('projects')
export class ProjectsController {
  constructor(private service: ProjectsService) {}

  @Post()
  async create(@Body() dto: CreateProjectDto) {
    const data = await this.service.create(dto);

    return ResponseUtil.success(data, 'Projet créé');
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
  @UseInterceptors(FileInterceptor('file'))
  addMedia(
    @Param('id') id: number,

    @UploadedFile()
    file: any,
  ) {
    return this.service.addMedia(+id, file);
  }
}
