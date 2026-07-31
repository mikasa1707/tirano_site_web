import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Param,
  Delete,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { MediaService } from './media.service';

import { CreateMediaDto } from './dto/create-media.dto';

@Controller('media')
export class MediaController {
  constructor(private service: MediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile()
    file: any,
    @Body()
    dto: CreateMediaDto,
  ) {
    return this.service.create(file, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(+id);
  }
}
