import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-social-links',
  standalone: true,
  templateUrl: './social-links.html',
})
export class SocialLinks {
  @Input()
  facebook = '';

  @Input()
  linkedin = '';

  @Input()
  youtube = '';

  @Input()
  instagram = '';
}
