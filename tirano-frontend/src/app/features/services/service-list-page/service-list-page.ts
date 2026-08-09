import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Service } from '../../../core/models/service';
import { ServiceApi } from '../../../core/api/service.api';
import { SiteSettingsService } from '../../../core/services/site-settings.service';

@Component({
  selector: 'app-service-list-page',
  imports: [],
  templateUrl: './service-list-page.html',
  styleUrl: './service-list-page.scss',
})
export class ServiceListPage implements OnInit {
  services?: Service[] = [];

  constructor(
    private serviceApi: ServiceApi,
    private cdr: ChangeDetectorRef,
    public readonly settings: SiteSettingsService,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.serviceApi
      .findAll({
        sortBy: 'created_at',
        sortOrder: 'DESC',
      })
      .subscribe({
        next: (response: any) => {
          this.services = response.data.data;
          console.log(this.services);
          this.cdr.detectChanges();
        },

        error: () => {},
      });
  }
}
