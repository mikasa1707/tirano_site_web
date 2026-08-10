import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, map, tap } from 'rxjs';

import { Setting } from '../models/setting';
import { SettingApi } from '../api/settings.api';

@Injectable({
  providedIn: 'root',
})
export class SiteSettingsService {
  private readonly settingSubject = new BehaviorSubject<Setting | null>(null);

  readonly setting$ = this.settingSubject.asObservable();

  private loaded = false;

  /**
   * Images par défaut du site.
   *
   * Les fichiers doivent être placés dans :
   * src/assets/images/
   */
  readonly defaultImages = {
    media: 'assets/images/default-media.png',
    service: 'assets/images/default-service.png',
    project: 'assets/images/default-project.png',
    product: 'assets/images/default-product.png',
    article: 'assets/images/default-article.png',
    testimonial: 'assets/images/default-testimonial.png',
    user: 'assets/images/default-user.png',
  };

  constructor(private readonly api: SettingApi) {}

  /**
   * Charge les paramètres du site.
   *
   * L'API retourne :
   *
   * {
   *   success: true,
   *   message: 'Success',
   *   data: {...}
   * }
   *
   * On retourne uniquement "data" aux composants.
   */
  load(): Observable<Setting> {
    if (this.loaded && this.settingSubject.value) {
      return of(this.settingSubject.value);
    }

    return this.api.findOne().pipe(
      map((response: any): Setting => response.data),

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
      map((response: any): Setting => response.data),

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
   * Logo du site.
   *
   * Pour l'instant, aucun logo n'est stocké
   * dans les médias Settings.
   */
  get logo(): string {
    return this.siteName;
  }

  /**
   * Image par défaut générique.
   */
  get defaultMediaImage(): string {
    return this.defaultImages.media;
  }

  /**
   * Image par défaut pour les services.
   */
  get defaultServiceImage(): string {
    return this.defaultImages.service;
  }

  /**
   * Image par défaut pour les projets.
   */
  get defaultProjectImage(): string {
    return this.defaultImages.project;
  }

  /**
   * Image par défaut pour les produits.
   */
  get defaultProductImage(): string {
    return this.defaultImages.product;
  }

  /**
   * Image par défaut pour les articles.
   */
  get defaultArticleImage(): string {
    return this.defaultImages.article;
  }

  /**
   * Image par défaut pour les témoignages.
   */
  get defaultTestimonialImage(): string {
    return this.defaultImages.testimonial;
  }

  /**
   * Image par défaut pour les utilisateurs.
   */
  get defaultUserImage(): string {
    return this.defaultImages.user;
  }

  /**
   * Retourne une image ou l'image par défaut.
   */
  getImage(
    url: string | null | undefined,
    type:
      'media' | 'service' | 'project' | 'product' | 'article' | 'testimonial' | 'user' = 'media',
  ): string {
    if (url && url.trim() !== '') {
      return url;
    }

    return this.defaultImages[type];
  }
}
