import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageListPage } from './message-list-page';

describe('MessageListPage', () => {
  let component: MessageListPage;
  let fixture: ComponentFixture<MessageListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageListPage],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
