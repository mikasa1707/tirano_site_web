import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-statistic-counter',
  standalone: true,
  templateUrl: './statistic-counter.html',
})
export class StatisticCounter {
  @Input()
  icon = 'fas fa-chart-line';

  @Input()
  value = 0;

  @Input()
  label = '';
}
