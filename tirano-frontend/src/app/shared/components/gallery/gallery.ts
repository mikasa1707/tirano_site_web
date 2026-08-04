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

  @Output()
  select = new EventEmitter<Media>();

  @Output()
  remove = new EventEmitter<Media>();

  onRemove(media: Media) {
    this.remove.emit(media);
  }
}
