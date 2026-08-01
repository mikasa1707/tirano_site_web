import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-contact-card',
  standalone: true,
  templateUrl: './contact-card.html',
})
export class ContactCard {
  @Input()
  title = '';

  @Input()
  icon = 'fas fa-phone';

  @Input()
  value = '';
}
