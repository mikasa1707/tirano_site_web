import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteService } from './entities/site-service.entity';
import { SiteServicesService } from './site-services.service';
import { SiteServicesController } from './site-services.controller';
import { MediaModule } from 'src/media/media.module';
import { Media } from 'src/media/entities/media.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SiteService, Media]), MediaModule],
  controllers: [SiteServicesController],
  providers: [SiteServicesService],
  exports: [SiteServicesService],
})
export class SiteServicesModule {}
