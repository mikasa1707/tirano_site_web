import { Component, Input } from '@angular/core';
import { DetailField } from '../../../core/models/detail-field';
import { Media } from '../../../core/models/media';
import { Testimonial } from '../../../core/models/testimonial';
import { DetailViewComponent } from "../../../shared/components/detail-view/detail-view";
import { MediaViewer } from "../../../shared/components/media-viewer/media-viewer";

@Component({
  selector: 'app-admin-testimonial-detail-page',
  imports: [DetailViewComponent, MediaViewer],
  templateUrl: './admin-testimonial-detail-page.html',
  styleUrl: './admin-testimonial-detail-page.scss',
})
export class AdminTestimonialDetailPage {
  @Input()
  testimonial?: Testimonial;

  selectedMedia?: Media;
  showMedia = false;

  fields: DetailField[] = [
    {
      key: 'name',
      label: 'Nom',
      type: 'text',
      col: 'col-6',
    },

    {
      key: 'role',
      label: 'Fonction',
      type: 'text',
      col: 'col-6',
    },

    {
      key: 'message',
      label: 'Message',
      type: 'html',
      col: 'col-12',
    },

    {
      key: 'medias',
      label: 'Galerie',
      type: 'gallery',
      col: 'col-12',
    },
  ];

  openMedia(media: Media) {
    this.selectedMedia = media;

    if (media.type === 'PDF') {
      window.open(media.url, '_blank');

      return;
    }

    if (media.type === 'VIDEO') {
      // ouvrir modal vidéo
      this.showMedia = true;
      return;
    }

    if (media.type === 'IMAGE') {
      // ouvrir modal image
      this.showMedia = true;
      return;
    }
  }

  closeMedia() {
    this.showMedia = false;
    this.selectedMedia = undefined;
  }
}
