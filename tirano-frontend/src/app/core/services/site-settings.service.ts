import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Setting } from '../models/setting';
import { SettingApi } from '../api/settings.api';

@Injectable({
  providedIn: 'root',
})
export class SiteSettingsService {
  private settingSubject = new BehaviorSubject<Setting | null>(null);

  setting$ = this.settingSubject.asObservable();

  constructor(private api: SettingApi) {}

  load() {
    this.api.findOne().subscribe({
      next: (res: any) => {
        this.settingSubject.next(res.data);
      },
    });
  }

  get setting(): Setting | null {
    return this.settingSubject.value;
  }

  get siteName(): string {
    return this.setting?.siteName ?? '';
  }

  get email(): string {
    return this.setting?.email ?? '';
  }

  get phone(): string {
    return this.setting?.phone ?? '';
  }

  get address(): string {
    return this.setting?.address ?? '';
  }

  get maintenance(): boolean {
    return this.setting?.maintenance ?? false;
  }

  get logo() {
    return this.setting?.medias?.find((m) => m.title === 'Logo');
  }

  get favicon() {
    return this.setting?.medias?.find((m) => m.title === 'Favicon');
  }
}
