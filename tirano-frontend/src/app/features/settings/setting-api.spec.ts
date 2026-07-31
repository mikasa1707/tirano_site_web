import { TestBed } from '@angular/core/testing';

import { SettingApi } from './setting-api';

describe('SettingApi', () => {
  let service: SettingApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
