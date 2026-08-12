import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { Article } from '../../../core/models/article';
import { Media } from '../../../core/models/media';
import { ApiService } from '../../../core/api/api.service';

@Component({
  selector: 'app-article-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './article-viewer.html',
  styleUrl: './article-viewer.scss',
})
export class ArticleViewerComponent {
  @Input() article: Article | null = null;
  @Input() open = false;

  @Output() closed = new EventEmitter<void>();

  selectedMedia: Media | null = null;
  mediaViewerOpen = false;

  
  constructor(
    public readonly api: ApiService,
  ) {}

  // =========================================================
  // FERMETURE
  // =========================================================

  close(): void {
    this.closed.emit();
  }

  // =========================================================
  // TYPE ARTICLE
  // =========================================================

  getArticleTypeLabel(type: string | undefined): string {
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
        return 'Publication';

      default:
        return 'Publication';
    }
  }

  getArticleTypeClass(type: string | undefined): string {
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

  // =========================================================
  // DATE
  // =========================================================

  getDateLabel(type: string | undefined): string {
    switch (type) {
      case 'EVENT':
        return 'Date de l’événement';

      case 'ADVERTISEMENT':
        return 'Date de publication';

      case 'PRESS':
        return 'Date de publication';

      case 'NEWS':
        return 'Date de publication';

      default:
        return 'Date de publication';
    }
  }

  // =========================================================
  // MEDIA TYPE
  // =========================================================

  isImageMedia(media: Media): boolean {
    const type = String(media.type ?? '').toLowerCase();

    return (
      type === 'image' ||
      type === 'images' ||
      type.startsWith('image/')
    );
  }

  isVideoMedia(media: Media): boolean {
    const type = String(media.type ?? '').toLowerCase();

    return (
      type === 'video' ||
      type === 'videos' ||
      type.startsWith('video/')
    );
  }

  isDocumentMedia(media: Media): boolean {
    return !this.isImageMedia(media) && !this.isVideoMedia(media);
  }

  // =========================================================
  // URL MEDIA
  // =========================================================

  getMediaUrl(media: Media): string {
    return media.url ? this.api.backend_url + media.url : '';
  }

  // =========================================================
  // DOCUMENTS
  // =========================================================

  getDocuments(): Media[] {
    if (!this.article?.medias?.length) {
      return [];
    }

    return this.article.medias.filter((media) =>
      this.isDocumentMedia(media),
    );
  }

  // =========================================================
  // IMAGES / VIDEOS
  // =========================================================

  getVisualMedias(): Media[] {
    if (!this.article?.medias?.length) {
      return [];
    }

    return this.article.medias.filter(
      (media) =>
        this.isImageMedia(media) ||
        this.isVideoMedia(media),
    );
  }

  // =========================================================
  // MEDIA UNIQUE
  // =========================================================

  hasSingleVisualMedia(): boolean {
    return this.getVisualMedias().length === 1;
  }

  getSingleVisualMedia(): Media | null {
    return this.getVisualMedias()[0] ?? null;
  }

  // =========================================================
  // CONTENT
  // =========================================================

  get paragraphs(): string[] {
    if (!this.article?.content) {
      return [];
    }

    return this.article.content
      .split(/\n\s*\n/)
      .map((text) => text.trim())
      .filter(Boolean);
  }

  // =========================================================
  // MEDIA / PARAGRAPHE
  //
  // NE PAS MODIFIER LA LOGIQUE DEMANDÉE
  // =========================================================

  getMediaForParagraph(index: number): Media | null {
    const medias = this.getVisualMedias();

    if (!medias.length) {
      return null;
    }

    /**
     * Média 1
     * -> paragraphe 1
     */
    if (index === 0) {
      return medias[0] ?? null;
    }

    /**
     * Média 2
     * -> paragraphe 3
     */
    if (index === 2) {
      return medias[1] ?? null;
    }

    /**
     * Média 3
     * -> paragraphe 5
     */
    if (index === 4) {
      return medias[2] ?? null;
    }

    return null;
  }

  // =========================================================
  // MEDIAS DEJA AFFICHES DANS LE CORPS
  // =========================================================

  getInlineVisualMedias(): Media[] {
    const medias: Media[] = [];

    for (let index = 0; index < this.paragraphs.length; index++) {
      const media = this.getMediaForParagraph(index);

      if (media && !medias.some((item) => item.id === media.id)) {
        medias.push(media);
      }
    }

    return medias;
  }

  // =========================================================
  // MEDIAS RESTANTS
  //
  // IMPORTANT :
  // On ne fait PAS simplement slice(3).
  //
  // On retire uniquement les médias réellement affichés
  // dans les paragraphes.
  //
  // Cela garantit qu'AUCUN média n'est perdu.
  // =========================================================

  getRemainingVisualMedias(): Media[] {
    const visualMedias = this.getVisualMedias();

    if (!visualMedias.length) {
      return [];
    }

    // Un seul média :
    // il est déjà affiché dans la partie single media.
    if (visualMedias.length === 1) {
      return [];
    }

    const inlineMedias = this.getInlineVisualMedias();

    return visualMedias.filter(
      (media) =>
        !inlineMedias.some(
          (inlineMedia) => inlineMedia.id === media.id,
        ),
    );
  }

  // =========================================================
  // ERREUR IMAGE
  // =========================================================

  onImageError(event: Event): void {
    const image = event.target as HTMLImageElement;

    if (image.src.includes('default-article.png')) {
      return;
    }

    image.src = 'assets/images/default-article.png';
  }

  // =========================================================
  // MEDIA VIEWER
  // =========================================================

  openMedia(media: Media): void {
    this.selectedMedia = media;
    this.mediaViewerOpen = true;
  }

  closeMedia(): void {
    this.mediaViewerOpen = false;
    this.selectedMedia = null;
  }

  // =========================================================
  // ESCAPE
  // =========================================================

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.mediaViewerOpen) {
      this.closeMedia();
      return;
    }

    if (this.open) {
      this.close();
    }
  }
}