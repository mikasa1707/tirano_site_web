import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceDetailPage } from './service-detail-page';

describe('ServiceDetailPage', () => {
  let component: ServiceDetailPage;
  let fixture: ComponentFixture<ServiceDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceDetailPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceDetailPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
