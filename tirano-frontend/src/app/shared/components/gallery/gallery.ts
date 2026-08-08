import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Media } from '../../../core/models/media';

@Component({
  selector: 'app-gallery',
  standalone: true,
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss',
})
export class Gallery {
  @Input()
  items: Media[] = [];

  @Input()
  removable = false;
  @Input()
  itemClass = 'col-6 col-md-4 col-lg-3';

  @Output()
  select = new EventEmitter<Media>();

  @Output()
  remove = new EventEmitter<Media>();

  onRemove(media: Media) {
    this.remove.emit(media);
  }
}
