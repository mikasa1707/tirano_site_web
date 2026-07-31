import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { SearchDto } from 'src/common/dto/search.dto';
import { SortDto } from 'src/common/dto/sort.dto';
import { ResponseUtil } from 'src/common/utils/response.util';
import { PaginationUtil } from 'src/common/utils/pagination.util';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  async findAll(
    @Query() pagination: PaginationDto,
    @Query() search: SearchDto,
    @Query() sort: SortDto,
  ) {
    const result = await this.service.findAll(pagination, search, sort);

    return ResponseUtil.paginate(
      result.users,
      PaginationUtil.createMeta(result.total, result.page, result.limit),
      'Liste des utilisateurs',
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
}
