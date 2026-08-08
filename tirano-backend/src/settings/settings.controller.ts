import {
  Body,
  Controller,
  Get,
  Put,
  Post,
  UploadedFile,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';

import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import { SettingsService } from './settings.service';

import { UpdateSettingDto } from './dto/update-setting.dto';

import { ResponseUtil } from '../common/utils/response.util';
import { Media } from 'src/media/entities/media.entity';

@Controller('settings')
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  @Get()
  async findOne() {
    const data = await this.service.getSettings();

    return ResponseUtil.success(data);
  }

  @Put()
  async update(@Body() dto: UpdateSettingDto) {
    const data = await this.service.updateSettings(dto);

    return ResponseUtil.success(data, 'Configuration modifiée');
  }

  @Post('logo')
  @UseInterceptors(FileInterceptor('file'))
  addLogo(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.service.addLogo(file);
  }

  @Post('favicon')
  @UseInterceptors(FileInterceptor('file'))
  addFavicon(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.service.addFavicon(file);
  }

  @Post('media')
  @UseInterceptors(FilesInterceptor('files', 10))
  async addMedia(
    @UploadedFiles()
    files: Express.Multer.File[],
  ): Promise<Media[]> {
    return await this.service.addMedia(files);
  }
}
