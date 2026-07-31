import { Test, TestingModule } from '@nestjs/testing';
import { SiteServicesController } from './site-services.controller';
import { SiteServicesService } from './site-services.service';

describe('SiteServicesController', () => {
  let controller: SiteServicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SiteServicesController],
      providers: [SiteServicesService],
    }).compile();

    controller = module.get<SiteServicesController>(SiteServicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
