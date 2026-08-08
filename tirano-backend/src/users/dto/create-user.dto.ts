import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
} from 'class-validator';

import { UserJob, UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  firstname!: string;

  @IsNotEmpty()
  lastname!: string;

  @IsEmail()
  email!: string;

  @IsNotEmpty()
  password!: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsEnum(UserJob)
  @IsOptional()
  job?: UserJob;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
