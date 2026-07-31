import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { UploadDto } from './dto/upload.dto';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile()
    file: Express.Multer.File,

    @Body()
    dto: UploadDto,
  ) {
    return this.storageService.upload(file, dto.folder);
  }
}
