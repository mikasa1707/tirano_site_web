import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteSettingsService } from './core/services/site-settings.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor(settings: SiteSettingsService) {
    settings.load();
  }
  protected readonly title = signal('tirano-frontend');
}
