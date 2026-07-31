import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsOptional()
  @IsString()
  client?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  realizationDate?: Date;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
