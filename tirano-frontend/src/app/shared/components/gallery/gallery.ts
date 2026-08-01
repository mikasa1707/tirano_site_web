import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Media } from '../../../core/models/media';

@Component({
  selector: 'app-gallery',
  standalone: true,
  templateUrl: './gallery.html',
})
export class Gallery {
  @Input()
  items: Media[] = [];
  @Output()
  select = new EventEmitter<Media>();
}
