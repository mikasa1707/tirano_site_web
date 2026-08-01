import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pdf-viewer',

  standalone: true,

  templateUrl: './pdf-viewer.html',
})
export class PdfViewer {
  @Input()
  url = '';
}
