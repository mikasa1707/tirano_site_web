import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticCounter } from './statistic-counter';

describe('StatisticCounter', () => {
  let component: StatisticCounter;
  let fixture: ComponentFixture<StatisticCounter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticCounter],
    }).compileComponents();

    fixture = TestBed.createComponent(StatisticCounter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
