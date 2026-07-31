import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Setting } from './entities/setting.entity';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [TypeOrmModule.forFeature([Setting]), MediaModule],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
