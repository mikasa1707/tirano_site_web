import { Routes } from '@angular/router';

import { ADMIN_ROUTES, AUTH_ROUTES, PUBLIC_ROUTES } from './routes';

export const routes: Routes = [
  ...PUBLIC_ROUTES,
  ...AUTH_ROUTES,
  ...ADMIN_ROUTES,
  {
    path: '**',
    redirectTo: '',
  },
];
