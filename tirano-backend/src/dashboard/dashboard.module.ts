import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { SiteService } from '../site-services/entities/site-service.entity';
import { Project } from '../projects/entities/project.entity';
import { Testimonial } from '../testimonials/entities/testimonial.entity';
import { Message } from '../messages/entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Product,
      SiteService,
      Project,
      Testimonial,
      Message,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
