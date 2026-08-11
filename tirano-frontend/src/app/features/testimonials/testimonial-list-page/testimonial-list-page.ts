import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TestimonialApi } from '../../../core/api/testimonial.api';
import { GalleryData, Media, GalleryMedia } from '../../../core/models/media';
import { Testimonial } from '../../../core/models/testimonial';
import { SiteSettingsService } from '../../../core/services/site-settings.service';

@Component({
  selector: 'app-testimonial-list-page',
  imports: [],
  templateUrl: './testimonial-list-page.html',
  styleUrl: './testimonial-list-page.scss',
})
export class TestimonialListPage implements OnInit {
  testimonials?: Testimonial[] = [];

  @Output()
  galleryOpen = new EventEmitter<GalleryData>();

  selectedGallery: GalleryData | null = null;

  constructor(
    private testimonialApi: TestimonialApi,
    private cdr: ChangeDetectorRef,
    public readonly settings: SiteSettingsService,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.testimonialApi
      .findAll({
        sortBy: 'created_at',
        sortOrder: 'DESC',
      })
      .subscribe({
        next: (response: any) => {
          this.testimonials = response.data.data;
          console.log(this.testimonials);
          this.cdr.detectChanges();
        },

        error: () => {},
      });
  }

  openGallery(title: string, description: string, medias?: Media[]): void {
    if (!medias?.length) {
      return;
    }

    const galleryMedias: GalleryMedia[] = medias.map((media) => ({
      id: media.id,
      url: media.url,
      type: media.type,
      originalName: media.filename,
    }));

    this.galleryOpen.emit({
      title,
      description,
      medias: galleryMedias,
    });
  }

  getTestimonialImage(testimonial: Testimonial): string {
    return this.settings.getImage(testimonial.medias?.[0]?.url, 'testimonial');
  }
}
