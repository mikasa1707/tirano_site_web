import {
  Body,
  Controller,
  Get,
  Put,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { SettingsService } from './settings.service';

import { UpdateSettingDto } from './dto/update-setting.dto';

import { ResponseUtil } from '../common/utils/response.util';

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
    file: any,
  ) {
    return this.service.addLogo(file);
  }

  @Post('favicon')
  @UseInterceptors(FileInterceptor('file'))
  addFavicon(
    @UploadedFile()
    file: any,
  ) {
    return this.service.addFavicon(file);
  }
}
