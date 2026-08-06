import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Gallery } from '../gallery/gallery';
import { Media } from '../../../core/models/media';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-view',
  standalone: true,
  imports: [Gallery, CommonModule],
  templateUrl: './detail-view.html',
})
export class DetailViewComponent {
  @Input()
  data: any;

  @Input()
  fields: any[] = [];

  @Output()
  mediaSelected = new EventEmitter<Media>();

  open(media: Media) {
    this.mediaSelected.emit(media);
  }
}
