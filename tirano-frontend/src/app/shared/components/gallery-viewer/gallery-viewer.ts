import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { GalleryData, GalleryMedia } from '../../../core/models/media';

import { ApiService } from '../../../core/api/api.service';

@Component({
  selector: 'app-gallery-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery-viewer.html',
  styleUrl: './gallery-viewer.scss',
})
export class GalleryViewerComponent implements OnChanges, OnDestroy {
  @Input()
  gallery: GalleryData | null = null;

  @Input()
  open = false;

  @Input()
  closeOnBackdrop = true;

  @ViewChild('galleryOverlay')
  galleryOverlay?: ElementRef<HTMLElement>;

  @Output()
  closed = new EventEmitter<void>();

  /**
   * Média actuellement sélectionné.
   */
  selectedMedia: GalleryMedia | null = null;

  /**
   * Viewer grand format ouvert.
   */
  lightboxOpen = false;

  /**
   * Sauvegarde du overflow original du body.
   */
  private bodyOverflowBackup = '';

  constructor(public readonly api: ApiService) {}

  // =========================================================
  // MEDIAS VISUELS
  // =========================================================

  get visualMedias(): GalleryMedia[] {
    if (!this.gallery?.medias) {
      return [];
    }

    return this.gallery.medias.filter((media) => this.isImage(media) || this.isVideo(media));
  }

  // =========================================================
  // DOCUMENTS
  // =========================================================

  get documents(): GalleryMedia[] {
    if (!this.gallery?.medias) {
      return [];
    }

    return this.gallery.medias.filter((media) => {
      const type = String(media?.type ?? '').toLowerCase();

      return type === 'pdf' || type === 'document';
    });
  }

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['open']) {
      return;
    }

    if (this.open) {
      this.lockBodyScroll();
    } else {
      this.closeLightbox();
      this.unlockBodyScroll();
    }
  }

  // =========================================================
  // ESC
  // =========================================================

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (!this.open) {
      return;
    }

    if (this.lightboxOpen) {
      this.closeLightbox();
      return;
    }

    this.close();
  }

  // =========================================================
  // OUVRIR MEDIA
  // =========================================================

  openMedia(media: GalleryMedia): void {

    console.log(media)
    if (!this.isImage(media) && !this.isVideo(media)) {
      return;
    }

    this.selectedMedia = media;
    this.lightboxOpen = true;
  }

  // =========================================================
  // FERMER LIGHTBOX
  // =========================================================

  closeLightbox(): void {
    this.lightboxOpen = false;
    this.selectedMedia = null;
  }

  // =========================================================
  // FERMER GALERIE
  // =========================================================

  close(): void {
    this.closeLightbox();

    this.open = false;

    this.unlockBodyScroll();

    this.closed.emit();
  }

  // =========================================================
  // BACKDROP
  // =========================================================

  onBackdropClick(event: MouseEvent): void {
    if (!this.closeOnBackdrop) {
      return;
    }

    const target = event.target as HTMLElement;

    const currentTarget = event.currentTarget as HTMLElement;

    if (target === currentTarget) {
      this.close();
    }
  }

  // =========================================================
  // URL MEDIA
  // =========================================================
  /**
   * La base contient uniquement :
   *
   * /uploads/settings/image.png
   *
   * L'URL du backend vient de :
   *
   * this.api.backend_url
   *
   * Exemple :
   * http://localhost:3000
   *
   * Résultat :
   * http://localhost:3000/uploads/settings/image.png
   */
  getMediaUrl(media: GalleryMedia | null | undefined): string {
    if (!media) {
      return '';
    }

    if (media.url) {
      return this.buildMediaUrl(media.url);
    }

    if (media.thumbnail) {
      return this.buildMediaUrl(media.thumbnail);
    }

    return '';
  }

  // =========================================================
  // THUMBNAIL
  // =========================================================

  getThumbnail(media: GalleryMedia): string {
    return this.getMediaUrl(media);
  }

  // =========================================================
  // CONSTRUCTION URL
  // =========================================================

  private buildMediaUrl(path: string): string {
    if (!path) {
      return '';
    }

    const cleanPath = path.trim();

    if (!cleanPath) {
      return '';
    }

    /*
     * Si jamais une URL complète existe déjà,
     * on la retourne directement.
     */
    if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
      return cleanPath;
    }

    /*
     * backend_url vient de l'environnement
     *
     * Exemple :
     * http://localhost:3000
     *
     * ou :
     * http://192.168.88.29:3000
     *
     * ou :
     * https://api.tirano.com
     */
    const backendUrl = this.api.backend_url.replace(/\/+$/, '');

    /*
     * On garantit qu'il y a un /
     * entre backend_url et le chemin.
     */
    const mediaPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;

    return `${backendUrl}${mediaPath}`;
  }

  // =========================================================
  // NOM MEDIA
  // =========================================================

  getMediaName(media: GalleryMedia): string {
    return media.name || media.originalName || 'Document';
  }

  // =========================================================
  // ICON DOCUMENT
  // =========================================================

  getDocumentIcon(media: GalleryMedia): string {
    const type = String(media?.type ?? '').toLowerCase();

    if (type === 'pdf') {
      return 'fa-solid fa-file-pdf';
    }

    return 'fa-solid fa-file-lines';
  }

  // =========================================================
  // TYPE IMAGE
  // =========================================================

  isImage(media: GalleryMedia | null | undefined): boolean {
    return String(media?.type ?? '').toLowerCase() === 'image';
  }

  // =========================================================
  // TYPE VIDEO
  // =========================================================

  isVideo(media: GalleryMedia | null | undefined): boolean {
    return String(media?.type ?? '').toLowerCase() === 'video';
  }

  // =========================================================
  // IMAGE ERROR
  // =========================================================

  onImageError(event: Event): void {
    const image = event.target as HTMLImageElement;

    image.style.display = 'none';
  }

  // =========================================================
  // LOCK BODY SCROLL
  // =========================================================

  private lockBodyScroll(): void {
    if (typeof document === 'undefined') {
      return;
    }

    if (this.bodyOverflowBackup === '') {
      this.bodyOverflowBackup = document.body.style.overflow;
    }

    document.body.style.overflow = 'hidden';

    document.body.classList.add('gallery-open');
  }

  // =========================================================
  // UNLOCK BODY SCROLL
  // =========================================================

  private unlockBodyScroll(): void {
    if (typeof document === 'undefined') {
      return;
    }

    document.body.style.overflow = this.bodyOverflowBackup;

    document.body.classList.remove('gallery-open');

    this.bodyOverflowBackup = '';
  }

  // =========================================================
  // DESTROY
  // =========================================================

  ngOnDestroy(): void {
    this.unlockBodyScroll();
  }
}
