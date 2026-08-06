import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private url = environment.apiUrl + '/api/notifications';
  private source = new EventSource(this.url);

  listen(): Observable<any> {
    return new Observable((observer) => {
      this.source.onmessage = (event) => {
        observer.next(JSON.parse(event.data));
      };
    });
  }
}
