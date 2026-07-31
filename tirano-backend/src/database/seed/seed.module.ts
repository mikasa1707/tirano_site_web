import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Setting } from 'src/settings/entities/setting.entity';
import { User } from 'src/users/entities/user.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Setting])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
