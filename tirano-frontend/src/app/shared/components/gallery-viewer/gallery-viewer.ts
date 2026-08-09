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

@Component({
  selector: 'app-gallery-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery-viewer.html',
  styleUrl: './gallery-viewer.scss',
})
export class GalleryViewerComponent implements OnChanges, OnDestroy {
  @Input() gallery: GalleryData | null = null;

  @Input() open = false;

  /**
   * Événement envoyé au parent lorsque
   * l'utilisateur ferme la galerie.
   */
  @Input() closeOnBackdrop = true;

  @ViewChild('galleryOverlay')
  galleryOverlay?: ElementRef<HTMLElement>;

  @Output() closed = new EventEmitter<void>();

  /**
   * Média actuellement sélectionné.
   */
  selectedMedia: GalleryMedia | null = null;

  /**
   * Permet de savoir si on affiche le viewer
   * grand format.
   */
  lightboxOpen = false;

  /**
   * Évite de restaurer le scroll plusieurs fois.
   */
  private bodyOverflowBackup = '';

  /**
   * Liste des médias visuels.
   */
  get visualMedias(): GalleryMedia[] {
    if (!this.gallery?.medias) {
      return [];
    }

    return this.gallery.medias.filter((media) => media.type === 'IMAGE' || media.type === 'VIDEO');
  }

  /**
   * Liste des documents.
   */
  get documents(): GalleryMedia[] {
    if (!this.gallery?.medias) {
      return [];
    }

    return this.gallery.medias.filter((media) => media.type === 'PDF' || media.type === 'DOCUMENT');
  }

  /**
   * Lorsqu'un Input change.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']) {
      if (this.open) {
        this.lockBodyScroll();
      } else {
        this.closeLightbox();
        this.unlockBodyScroll();
      }
    }
  }

  /**
   * Fermer avec ESC.
   */
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

  /**
   * Ouvre un média.
   */
  openMedia(media: GalleryMedia): void {
    if (media.type === 'IMAGE' || media.type === 'VIDEO') {
      this.selectedMedia = media;
      this.lightboxOpen = true;
    }
  }

  /**
   * Ferme le média grand format.
   */
  closeLightbox(): void {
    this.lightboxOpen = false;
    this.selectedMedia = null;
  }

  /**
   * Ferme la galerie.
   */
  close(): void {
    this.closeLightbox();
    this.open = false;
    this.unlockBodyScroll();
    this.closed.emit();
  }

  /**
   * Gestion du clic sur le fond.
   */
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

  /**
   * Retourne l'URL d'une miniature.
   */
  getThumbnail(media: GalleryMedia): string {
    return media.thumbnail || media.url;
  }

  /**
   * Nom affiché du document/média.
   */
  getMediaName(media: GalleryMedia): string {
    return media.name || media.originalName || 'Document';
  }

  /**
   * Icône FontAwesome selon le type.
   */
  getDocumentIcon(media: GalleryMedia): string {
    if (media.type === 'PDF') {
      return 'fa-solid fa-file-pdf';
    }

    return 'fa-solid fa-file-lines';
  }

  /**
   * Gestion d'une image inaccessible.
   */
  onImageError(event: Event): void {
    const image = event.target as HTMLImageElement;

    image.style.display = 'none';
  }

  /**
   * Empêche le scroll de la page derrière la galerie.
   */

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

  /**
   * Restaure le scroll.
   */
  private unlockBodyScroll(): void {
    if (typeof document === 'undefined') {
      return;
    }

    document.body.style.overflow = this.bodyOverflowBackup;
    document.body.classList.remove('gallery-open');
    this.bodyOverflowBackup = '';
  }

  ngOnDestroy(): void {
    this.unlockBodyScroll();
  }
}
