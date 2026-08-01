import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'admin/login',
    loadComponent: () =>
      import('../features/auth/login-page').then((m) => m.LoginPage),
  },
];
