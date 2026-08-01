import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-timeline',

  standalone: true,

  templateUrl: './timeline.html',
})
export class Timeline {
  @Input()
  items: any[] = [];
}
