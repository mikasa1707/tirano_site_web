import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class NotificationsService {
  private events = new Subject<any>();

  stream() {
    return this.events.asObservable();
  }

  notify(data: any) {
    this.events.next(data);
  }
}
