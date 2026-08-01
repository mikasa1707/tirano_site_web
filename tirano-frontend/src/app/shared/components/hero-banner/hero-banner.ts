import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hero-banner',

  standalone: true,

  templateUrl: './hero-banner.html',
})
export class HeroBanner {
  @Input()
  title = '';

  @Input()
  subtitle = '';

  @Input()
  image = '';
}
