import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Testimonial } from './entities/testimonial.entity';
import { TestimonialsController } from './testimonials.controller';
import { TestimonialsService } from './testimonials.service';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [TypeOrmModule.forFeature([Testimonial]), MediaModule],
  controllers: [TestimonialsController],
  providers: [TestimonialsService],
  exports: [TestimonialsService],
})
export class TestimonialsModule {}
