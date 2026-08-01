import { Component, Input } from '@angular/core';
import { RichViewer } from '../rich-viewer/rich-viewer';
import { Gallery } from '../gallery/gallery';
import { Content } from '../../../core/models/content';

@Component({
  selector: 'app-content-viewer',
  standalone: true,
  imports: [RichViewer, Gallery],
  templateUrl: './content-viewer.html',
})
export class ContentViewer {
  @Input({ required: true })
  content!: Content;
}
