import { Component, Input } from '@angular/core';
import { DetailField } from '../../../core/models/detail-field';
import { Media } from '../../../core/models/media';
import { Product } from '../../../core/models/product';
import { DetailViewComponent } from "../../../shared/components/detail-view/detail-view";
import { MediaViewer } from "../../../shared/components/media-viewer/media-viewer";

@Component({
  selector: 'app-admin-product-detail-page',
  imports: [DetailViewComponent, MediaViewer],
  templateUrl: './admin-product-detail-page.html',
  styleUrl: './admin-product-detail-page.scss',
})
export class AdminProductDetailPage {
  @Input()
  product?: Product;

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
      key: 'reference',
      label: 'Référence',
      type: 'text',
      col: 'col-6',
    },

    {
      key: 'price',
      label: 'Prix',
      type: 'currency',
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
