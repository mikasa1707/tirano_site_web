import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateSiteServiceDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
