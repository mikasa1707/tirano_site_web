import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateMediaDto {
  @IsOptional()
  @IsString()
  description?: string;
}
