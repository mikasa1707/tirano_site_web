import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-image-zoom',
  standalone: true,
  templateUrl: './image-zoom.html',
  styleUrl: './image-zoom.scss',
})
export class ImageZoom {

  @Input() image: string | null = null;

  @Input() title = '';

  @Input() alt = '';

  @Output() closed = new EventEmitter<void>();


  // =========================================================
  // CLOSE
  // =========================================================

  close(): void {
    this.closed.emit();
  }


  // =========================================================
  // CLICK BACKDROP
  // =========================================================

  onBackdropClick(event: MouseEvent): void {

    if (event.target === event.currentTarget) {
      this.close();
    }

  }


  // =========================================================
  // ESC
  // =========================================================

  onKeyDown(event: KeyboardEvent): void {

    if (event.key === 'Escape') {
      this.close();
    }

  }

}