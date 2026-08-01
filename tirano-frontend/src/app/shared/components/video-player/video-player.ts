import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-video-player',

  standalone: true,

  templateUrl: './video-player.html',
})
export class VideoPlayer {
  @Input()
  url = '';
}
