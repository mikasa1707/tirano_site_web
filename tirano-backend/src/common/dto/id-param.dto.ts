import { IsInt, IsNotEmpty } from 'class-validator';

import { Type } from 'class-transformer';

export class IdParamDto {
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  id!: number;
}
