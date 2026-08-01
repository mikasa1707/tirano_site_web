import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  templateUrl: './skeleton.html',
})
export class Skeleton {

  @Input()
  type:
    | 'card'
    | 'table'
    | 'list'
    | 'text'
    | 'avatar'
    | 'dashboard' = 'card';

  @Input()
  rows = 5;

}