import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-content-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './content-card.html',
})
export class ContentCard {
  @Input()
  title = '';

  @Input()
  subtitle = '';

  @Input()
  image = '';

  @Input()
  badge = '';

  @Input()
  description = '';

  @Input()
  route = '';

  @Input()
  buttonText = 'Voir';
}
