import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMessageListPage } from './admin-message-list-page';

describe('AdminMessageListPage', () => {
  let component: AdminMessageListPage;
  let fixture: ComponentFixture<AdminMessageListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMessageListPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminMessageListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
