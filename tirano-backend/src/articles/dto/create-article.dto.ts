import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

import { ArticleType } from '../enums/article-type.enum';

export class CreateArticleDto {
  @IsString()
  title!: string;

  @IsString()
  slug!: string;

  @IsString()
  content!: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsEnum(ArticleType)
  type!: ArticleType;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  publishedAt?: Date;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
