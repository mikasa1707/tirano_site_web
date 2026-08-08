import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';

import { Setting } from '../models/setting';
import { SettingApi } from '../api/settings.api';

@Injectable({
  providedIn: 'root',
})
export class SiteSettingsService {
  private readonly settingSubject = new BehaviorSubject<Setting | null>(null);

  readonly setting$ = this.settingSubject.asObservable();

  private loaded = false;

  constructor(private readonly api: SettingApi) {}

  /**
   * Charge les paramètres du site.
   *
   * L'API retourne :
   * {
   *   success: true,
   *   message: 'Success',
   *   data: {...}
   * }
   *
   * On retourne uniquement data aux composants.
   */
  load(): Observable<Setting> {
    if (this.loaded && this.settingSubject.value) {
      return new Observable<Setting>((subscriber) => {
        subscriber.next(this.settingSubject.value!);
        subscriber.complete();
      });
    }

    return this.api.findOne().pipe(
      map((response: any): Setting => {
        return response.data;
      }),

      tap((setting: Setting) => {
        this.settingSubject.next(setting);

        this.loaded = true;

        console.log('Settings chargés:', setting);
      }),
    );
  }

  /**
   * Force le rechargement depuis l'API.
   */
  reload(): Observable<Setting> {
    this.loaded = false;

    return this.api.findOne().pipe(
      map((response: any): Setting => {
        return response.data;
      }),

      tap((setting: Setting) => {
        this.settingSubject.next(setting);

        this.loaded = true;
      }),
    );
  }

  /**
   * Configuration actuelle.
   */
  get setting(): Setting | null {
    return this.settingSubject.value;
  }

  /**
   * Nom du site.
   */
  get siteName(): string {
    return this.setting?.siteName ?? 'Tirano';
  }

  /**
   * Description.
   */
  get description(): string {
    return this.setting?.description ?? '';
  }

  /**
   * Email.
   */
  get email(): string {
    return this.setting?.email ?? '';
  }

  /**
   * Téléphone.
   */
  get phone(): string {
    return this.setting?.phone ?? '';
  }

  /**
   * Adresse.
   */
  get address(): string {
    return this.setting?.address ?? '';
  }

  /**
   * Facebook.
   */
  get facebook(): string {
    return this.setting?.facebook ?? '';
  }

  /**
   * Instagram.
   */
  get instagram(): string {
    return this.setting?.instagram ?? '';
  }

  /**
   * LinkedIn.
   */
  get linkedin(): string {
    return this.setting?.linkedin ?? '';
  }

  /**
   * YouTube.
   */
  get youtube(): string {
    return this.setting?.youtube ?? '';
  }

  /**
   * Mode maintenance.
   */
  get maintenance(): boolean {
    return this.setting?.maintenance ?? false;
  }

  /**
   * Pour l'instant, il n'y a pas de logo
   * stocké dans les médias Settings.
   *
   * On utilise donc le nom du site.
   */
  get logo(): string {
    return this.siteName;
  }
}
