import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SiteSettingsService } from '../../../core/services/site-settings.service';
import { Setting } from '../../../core/models/setting';
import { ApiService } from '../../../core/api/api.service';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer implements OnInit {
  readonly currentYear = new Date().getFullYear();
  setting?: Setting;

  constructor(
    public readonly api: ApiService,
    public readonly settings: SiteSettingsService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  private loadSettings(): void {
    this.settings.load().subscribe({
      next: (response: any) => {
        this.setting = response.data;
        this.cdr.detectChanges();
        console.log(this.setting);
      },

      error: (error) => {
        console.error('Erreur chargement configuration du site', error);
      },
    });
  }
}
