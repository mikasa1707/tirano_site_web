import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteSettingsService } from '../../../core/services/site-settings.service';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.html',
})
export class Footer {
  readonly currentYear = new Date().getFullYear();
  
  constructor(public readonly settings: SiteSettingsService) {}
}
