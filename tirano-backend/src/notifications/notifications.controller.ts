import { Controller, Sse } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private notifications: NotificationsService) {}

  @Sse()
  sse() {
    return this.notifications.stream().pipe(
      map((data) => ({
        data,
      })),
    );
  }
}
