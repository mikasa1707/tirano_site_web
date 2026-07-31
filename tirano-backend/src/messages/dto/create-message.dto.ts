import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  fullname!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  subject!: string;

  @IsString()
  message!: string;
}
