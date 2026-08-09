import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Service } from '../../../core/models/service';
import { ServiceApi } from '../../../core/api/service.api';
import { SiteSettingsService } from '../../../core/services/site-settings.service';
import { GalleryData } from '../../../core/models/media';
import { GalleryViewerComponent } from "../../../shared/components/gallery-viewer/gallery-viewer";

@Component({
  selector: 'app-service-list-page',
  imports: [GalleryViewerComponent],
  templateUrl: './service-list-page.html',
  styleUrl: './service-list-page.scss',
})
export class ServiceListPage implements OnInit {
  services?: Service[] = [];

  galleryOpen = false;
  selectedGallery: GalleryData | null = null;

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

  openGallery(service: Service): void {
    this.selectedGallery = {
      title: service.title,
      description: service.description,

      medias: (service.medias ?? []).map((media: any) => ({
        id: media.id,

        type: this.getMediaType(media),

        url: media.url,

        name: media.originalName,

        thumbnail: media.thumbnail,
      })),
    };

    this.galleryOpen = true;
  }

  /**
   * Détermine le type du média.
   */
  private getMediaType(media: any): 'IMAGE' | 'VIDEO' | 'PDF' | 'DOCUMENT' {
    const mimeType = media.mimeType ?? media.type ?? '';

    if (mimeType.startsWith('image/')) {
      return 'IMAGE';
    }

    if (mimeType.startsWith('video/')) {
      return 'VIDEO';
    }

    if (mimeType === 'application/pdf' || media.originalName?.toLowerCase().endsWith('.pdf')) {
      return 'PDF';
    }

    return 'DOCUMENT';
  }

  /**
   * Ferme la galerie.
   */
  closeGallery(): void {
    this.galleryOpen = false;
    this.selectedGallery = null;
  }
}
