import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Setting } from '../../core/models/setting';
import { SiteSettingsService } from '../../core/services/site-settings.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage implements OnInit {
  setting?: Setting;

  constructor(private siteSettings: SiteSettingsService) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  private loadSettings(): void {
    this.siteSettings.load().subscribe({
      next: (response: any) => {
        this.setting = response.data;

        console.log('Settings Home:', this.setting);
      },

      error: (error) => {
        console.error('Erreur chargement configuration du site', error);
      },
    });
  }

  get heroImage(): string {
    return 'assets/images/machine.png';
  }
}
