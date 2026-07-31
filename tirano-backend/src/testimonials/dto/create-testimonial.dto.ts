import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateTestimonialDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsString()
  message!: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
