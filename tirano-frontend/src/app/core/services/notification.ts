import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

import { fetchEventSource } from '@microsoft/fetch-event-source';

import { environment } from '../../../environments/environments';
import { AuthService } from '../api/auth.api';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly url = environment.apiUrl + '/api/notifications';

  constructor(
    private readonly auth: AuthService,
    private readonly zone: NgZone,
  ) {}

  listen(): Observable<any> {
    return new Observable((observer) => {
      const token = this.auth.getToken();

      if (!token) {
        observer.error(new Error('Utilisateur non authentifié'));

        return;
      }

      const controller = new AbortController();

      fetchEventSource(this.url, {
        method: 'GET',

        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'text/event-stream',
        },

        signal: controller.signal,

        onopen: async (response) => {
          if (!response.ok) {
            throw new Error(`Erreur SSE : ${response.status} ${response.statusText}`);
          }

          console.log('[SSE] Connexion notifications établie');
        },

        onmessage: (event) => {
          if (!event.data) {
            return;
          }

          try {
            const data = JSON.parse(event.data);

            this.zone.run(() => {
              observer.next(data);
            });
          } catch (error) {
            console.error('[SSE] Données invalides :', event.data, error);
          }
        },

        onerror: (error) => {
          console.error('[SSE] Erreur connexion :', error);

          /*
           * Retourne une erreur uniquement si
           * la connexion doit réellement être arrêtée.
           */
          throw error;
        },

        onclose: () => {
          console.log('[SSE] Connexion fermée');

          this.zone.run(() => {
            observer.complete();
          });
        },
      }).catch((error) => {
        /*
         * AbortController déclenche une erreur
         * lorsque le composant est détruit.
         */
        if (!controller.signal.aborted) {
          this.zone.run(() => {
            observer.error(error);
          });
        }
      });

      /*
       * Désabonnement Angular/RxJS
       */
      return () => {
        controller.abort();

        console.log('[SSE] Connexion notifications arrêtée');
      };
    });
  }
}
