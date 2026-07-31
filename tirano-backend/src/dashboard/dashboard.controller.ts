import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ResponseUtil } from '../common/utils/response.util';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Get()
  async index() {
    const data = await this.service.getDashboard();

    return ResponseUtil.success(data, 'Dashboard');
  }
}
