import { Message } from '../entities/message.entity';

export class MessageResponseDto {
  id: number;
  fullname: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  created_at: Date;

  constructor(message: Message) {
    this.id = message.id;
    this.fullname = message.fullname;
    this.email = message.email;
    this.phone = message.phone;
    this.subject = message.subject;
    this.message = message.message;
    this.isRead = message.isRead;
    this.created_at = message.created_at;
  }
}
