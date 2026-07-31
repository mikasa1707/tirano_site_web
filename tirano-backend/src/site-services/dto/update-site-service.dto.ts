import { PartialType } from '@nestjs/mapped-types';
import { CreateSiteServiceDto } from './create-site-service.dto';

export class UpdateSiteServiceDto extends PartialType(CreateSiteServiceDto) {}
