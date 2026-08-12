import { inject, PLATFORM_ID } from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../api/auth.api';

export const authGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);
  const auth = inject(AuthService);

  /*
   * SSR
   */
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  /*
   * Token absent, invalide ou expiré
   */
  if (!auth.isTokenValid()) {
    auth.clearToken();

    return router.createUrlTree(['/admin/login']);
  }

  return true;
};
