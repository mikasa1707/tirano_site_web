import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  templateUrl: './kpi-card.html',
})
export class KpiCard {
  @Input()
  title = '';

  @Input()
  value: string | number = 0;

  @Input()
  subtitle = '';

  @Input()
  icon = 'fa-chart-column';

  @Input()
  color: 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'secondary' | 'dark' = 'primary';

  @Input()
  trend?: number;
}
