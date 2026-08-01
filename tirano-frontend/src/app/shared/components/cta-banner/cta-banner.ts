import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cta-banner',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cta-banner.html',
})
export class CtaBanner {
  @Input()
  title = '';

  @Input()
  subtitle = '';

  @Input()
  buttonText = 'En savoir plus';

  @Input()
  buttonLink = '/';

  @Input()
  image = '';
}
