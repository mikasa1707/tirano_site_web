import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-file-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-selector.html',
})
export class FileSelector {
  @Output()
  selected = new EventEmitter<File>();

  preview: string | null = null;

  change(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    this.preview = URL.createObjectURL(file);

    this.selected.emit(file);
  }
}
