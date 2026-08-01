import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../api/auth.api';


export const authGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);

  const router = inject(Router);

  const auth = inject(AuthService);

  // SSR : on laisse passer
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  // Navigateur : vérification JWT
  if (auth.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/admin/login']);
};
