import { Component, Input } from '@angular/core';
import { DetailField } from '../../../core/models/detail-field';
import { Media } from '../../../core/models/media';
import { Article } from '../../../core/models/article';
import { DetailViewComponent } from "../../../shared/components/detail-view/detail-view";
import { MediaViewer } from "../../../shared/components/media-viewer/media-viewer";

@Component({
  selector: 'app-admin-article-detail-page',
  imports: [DetailViewComponent, MediaViewer],
  templateUrl: './admin-article-detail-page.html',
  styleUrl: './admin-article-detail-page.scss',
})
export class AdminArticleDetailPage {
  @Input()
  article?: Article;

  selectedMedia?: Media;
  showMedia = false;

  fields: DetailField[] = [
    {
      key: 'title',
      label: 'Titre',
      type: 'text',
      col: 'col-6',
    },

    {
      key: 'client',
      label: 'Client',
      type: 'text',
      col: 'col-6',
    },

    {
      key: 'location',
      label: 'Localisation',
      type: 'text',
      col: 'col-6',
    },

    {
      key: 'realizationDate',
      label: 'Date de réalisation',
      type: 'date',
      col: 'col-6',
    },

    {
      key: 'description',
      label: 'Description',
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
