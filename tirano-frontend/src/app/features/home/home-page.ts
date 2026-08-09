import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Setting } from '../../core/models/setting';
import { SiteSettingsService } from '../../core/services/site-settings.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage implements OnInit {
  setting?: Setting;

  constructor(
    private siteSettings: SiteSettingsService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  private loadSettings(): void {
    this.siteSettings.load().subscribe({
      next: (response: any) => {
        this.setting = response.data;
        this.cdr.detectChanges();

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
