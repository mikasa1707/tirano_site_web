import { Component, Input } from '@angular/core';
import { DetailField } from '../../../core/models/detail-field';
import { Media } from '../../../core/models/media';
import { Project } from '../../../core/models/project';
import { DetailViewComponent } from '../../../shared/components/detail-view/detail-view';
import { MediaViewer } from '../../../shared/components/media-viewer/media-viewer';
import { ModalComponent } from "../../../shared/components/modal/modal";

@Component({
  selector: 'app-admin-project-detail-page',
  imports: [DetailViewComponent, MediaViewer, ModalComponent],
  templateUrl: './admin-project-detail-page.html',
  styleUrl: './admin-project-detail-page.scss',
})
export class AdminProjectDetailPage {
  @Input()
  project?: Project;

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
      key: 'active',
      label: 'Statut',
      type: 'badge',
      col: 'col-6',
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
