import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rich-viewer',
  standalone: true,
  templateUrl: './rich-viewer.html',
})
export class RichViewer {
  @Input()
  html = '';
}
