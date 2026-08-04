import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-file-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-selector.html',
})
export class FileSelector {
  @Input() multiple = false;

  @Output() selected = new EventEmitter<File[]>();

  previews: string[] = [];

  change(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const files = Array.from(input.files);

    this.previews.forEach((url) => URL.revokeObjectURL(url));

    this.previews = files.map((file) => URL.createObjectURL(file));

    this.selected.emit(files);
  }
}
