import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticleApi } from '../../../core/api/article.api';
import { Article } from '../../../core/models/article';
import { GalleryData, GalleryMedia, Media } from '../../../core/models/media';
import { SiteSettingsService } from '../../../core/services/site-settings.service';
import { ApiService } from '../../../core/api/api.service';

@Component({
  selector: 'app-article-list-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './article-list-page.html',
  styleUrl: './article-list-page.scss',
})
export class ArticleListPage implements OnInit {
  /* =========================================================
     ARTICLES
  ========================================================= */

  articles: Article[] = [];

  filteredArticles: Article[] = [];

  showAllArticles = false;

  readonly initialArticleLimit = 3;

  /* =========================================================
     GALERIE
  ========================================================= */

  @Output() galleryOpen = new EventEmitter<GalleryData>();
  @Output() articleOpen = new EventEmitter<Article>();

  selectedGallery: GalleryData | null = null;

  /* =========================================================
     CONSTRUCTOR
  ========================================================= */

  constructor(
    private readonly articleApi: ArticleApi,
    private readonly cdr: ChangeDetectorRef,
    public readonly settings: SiteSettingsService,
    public readonly api: ApiService,
  ) {}

  /* =========================================================
     INIT
  ========================================================= */

  ngOnInit(): void {
    this.load();
  }

  /* =========================================================
     LOAD ARTICLES
  ========================================================= */

  load(): void {
    this.articleApi
      .findAll({
        limit: 1000,
        sortBy: 'created_at',
        sortOrder: 'DESC',
      })
      .subscribe({
        next: (response: any) => {
          if (Array.isArray(response?.data)) {
            this.articles = response.data;
          } else {
            this.articles = response?.data?.data ?? [];
          }
          this.filteredArticles = [...this.articles];
          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error('Erreur chargement articles', error);
          this.articles = [];
          this.filteredArticles = [];
        },
      });
  }

  /* =========================================================
     VOIR PLUS
  ========================================================= */

  showMoreArticles(): void {
    this.showAllArticles = true;
  }

  /* =========================================================
     VOIR MOINS
  ========================================================= */

  showLessArticles(): void {
    this.showAllArticles = false;
  }

  /* =========================================================
     GALERIE
  ========================================================= */

  openGallery(title: string, description: string, medias?: Media[]): void {
    if (!medias?.length) {
      return;
    }

    const galleryMedias: GalleryMedia[] = medias.map((media) => ({
      id: media.id,

      url: this.api.backend_url + media.url,

      type: this.getMediaType(media),

      originalName: media.title ?? media.filename ?? '',
    }));

    const gallery: GalleryData = {
      title,

      description,

      medias: galleryMedias,
    };

    this.selectedGallery = gallery;

    this.galleryOpen.emit(gallery);
  }

  /* =========================================================
     MEDIA TYPE
  ========================================================= */

  private getMediaType(media: Media): 'IMAGE' | 'VIDEO' | 'PDF' | 'DOCUMENT' {
    const mimeType = media.type?.toLowerCase() ?? '';

    /*
     * IMAGE
     */

    if (mimeType.startsWith('image/')) {
      return 'IMAGE';
    }

    /*
     * VIDEO
     */

    if (mimeType.startsWith('video/')) {
      return 'VIDEO';
    }

    /*
     * PDF
     */

    const filename = media.filename?.toLowerCase() ?? '';

    if (filename.endsWith('.pdf')) {
      return 'PDF';
    }

    /*
     * DOCUMENT
     */

    return 'DOCUMENT';
  }

  /* =========================================================
     IMAGE PRINCIPALE
  ========================================================= */

  getArticleImage(article: Article): string {
    const image = article.medias?.find(
      (media: Media) => String(media.type ?? '').toUpperCase() === 'IMAGE',
    );

    return image?.url ? this.api.backend_url + image.url : 'assets/images/default-article.png';
  }

  /* =========================================================
     MEDIA
  ========================================================= */

  hasMedia(article: Article): boolean {
    return Array.isArray(article.medias) && article.medias.length > 0;
  }

  /* =========================================================
     TYPE ARTICLE
  ========================================================= */

  getArticleTypeLabel(type: string): string {
    switch (type) {
      case 'NEWS':
        return 'Actualité';

      case 'PRESS':
        return 'Presse';

      case 'EVENT':
        return 'Événement';

      case 'ADVERTISEMENT':
        return 'Annonce';

      case 'OTHER':
        return 'Autre';

      default:
        return type;
    }
  }

  /* =========================================================
     TYPE ARTICLE — CSS
  ========================================================= */

  getArticleTypeClass(type: string): string {
    switch (type) {
      case 'NEWS':
        return 'article-type-news';

      case 'PRESS':
        return 'article-type-press';

      case 'EVENT':
        return 'article-type-event';

      case 'ADVERTISEMENT':
        return 'article-type-advertisement';

      case 'OTHER':
        return 'article-type-other';

      default:
        return 'article-type-other';
    }
  }

  isImageMedia(media: Media): boolean {
    const type = String(media.type ?? '').toLowerCase();

    return type === 'image' || type === 'images' || type.startsWith('image/');
  }

  isVideoMedia(media: Media): boolean {
    const type = String(media.type ?? '').toLowerCase();

    return type === 'video' || type === 'videos' || type.startsWith('video/');
  }

  getMediaUrl(media: any): string {
    if (!media) {
      return this.defaultImage;
    }

    if (media.url) {
      return this.api.backend_url + media.url;
    }

    return this.defaultImage;
  }

  get defaultImage(): string {
    return 'assets/images/default-product.jpg';
  }

  onMediaError(event: Event): void {
    const image = event.target as HTMLImageElement;

    console.error('Erreur chargement image article:', image.src);

    image.src = 'assets/images/default-article.png';
  }

  openArticle(article: Article): void {
    this.articleOpen.emit(article);
  }
}
