import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Service } from '../../../core/models/service';
import { ServiceApi } from '../../../core/api/service.api';
import { SiteSettingsService } from '../../../core/services/site-settings.service';
import { GalleryData, GalleryMedia, Media } from '../../../core/models/media';

@Component({
  selector: 'app-service-list-page',
  imports: [],
  templateUrl: './service-list-page.html',
  styleUrl: './service-list-page.scss',
})
export class ServiceListPage implements OnInit {
  services?: Service[] = [];

  @Output()
  galleryOpen = new EventEmitter<GalleryData>();

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

  openGallery(
    title: string,
    medias?: Media[],
  ): void {

    if (!medias?.length) {
      return;
    }

    const galleryMedias: GalleryMedia[] =
      medias.map((media) => ({
        id: media.id,
        url: media.url,
        type: media.type,
        originalName: media.filename,
      }));

    this.galleryOpen.emit({
      title,
      medias: galleryMedias,
    });
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
}
