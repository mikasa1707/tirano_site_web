import { Component, Input } from '@angular/core';
import { VideoPlayer } from '../video-player/video-player';
import { PdfViewer } from '../pdf-viewer/pdf-viewer';
import { Media } from '../../../core/models/media';

@Component({
  selector: 'app-media-viewer',
  standalone: true,
  imports: [VideoPlayer, PdfViewer],
  templateUrl: './media-viewer.html',
})
export class MediaViewer {
  @Input()
  media!: Media;
}
