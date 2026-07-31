import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [TypeOrmModule.forFeature([Project]), MediaModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
