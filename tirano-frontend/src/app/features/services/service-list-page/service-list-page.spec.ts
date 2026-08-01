import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceListPage } from './service-list-page';

describe('ServiceListPage', () => {
  let component: ServiceListPage;
  let fixture: ComponentFixture<ServiceListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceListPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
