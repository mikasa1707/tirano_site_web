import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-header',
  standalone: true,
  templateUrl: './section-header.html',
})
export class SectionHeader {
  @Input()
  title = '';

  @Input()
  subtitle = '';

  @Input()
  centered = true;
}
