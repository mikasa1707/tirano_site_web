import { Component, Input } from '@angular/core';
import { Service } from '../../../core/models/service';
import { DetailViewComponent } from '../../../shared/components/detail-view/detail-view';
import { DetailField } from '../../../core/models/detail-field';
import { Media } from '../../../core/models/media';
import { MediaViewer } from "../../../shared/components/media-viewer/media-viewer";
import { ModalComponent } from "../../../shared/components/modal/modal";

@Component({
  selector: 'app-admin-service-detail-page',
  standalone: true,
  imports: [DetailViewComponent, MediaViewer, ModalComponent],
  templateUrl: './admin-service-detail-page.html',
})
export class AdminServiceDetailPage {
  @Input()
  service?: Service;

  selectedMedia?: Media;
  showMedia = false;

  fields: DetailField[] = [
    {
      key: 'title',
      label: 'Nom',
      type: 'text',
      col: 'col-6',
    },

    {
      key: 'shortDescription',
      label: 'Description courte',
      type: 'text',
      col: 'col-6',
    },

    {
      key: 'description',
      label: 'Description',
      type: 'html',
      col: 'col-12',
    },

    // {
    //   key: 'active',
    //   label: 'Statut',
    //   type: 'badge',
    //   badge: {
    //     trueLabel: 'Actif',
    //     falseLabel: 'Inactif',
    //   },
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
