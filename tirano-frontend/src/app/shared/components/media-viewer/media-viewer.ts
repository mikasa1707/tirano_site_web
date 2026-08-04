import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Media } from '../../../core/models/media';

@Component({
  selector: 'app-media-viewer',
  standalone: true,
  templateUrl: './media-viewer.html',
  styleUrl: './media-viewer.scss',
})
export class MediaViewer {
  @Input()
  media?: Media;

  @Output()
  closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }
}
