import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { MediaModule } from 'src/media/media.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), MediaModule],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
