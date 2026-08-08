import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';
import { FilesInterceptor } from '@nestjs/platform-express';

interface QueryDto {
  page?: string;
  limit?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

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

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateUserDto) {
    return this.service.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,

    @Body() dto: UpdateUserDto,
  ) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: number) {
    return this.service.remove(+id);
  }

  @Post(':id/media')
  @UseInterceptors(FilesInterceptor('files', 10))
  async addMedia(
    @Param('id') id: number,

    @UploadedFiles()
    files: Express.Multer.File[],
  ) {
    return this.service.addMedia(+id, files);
  }
}
