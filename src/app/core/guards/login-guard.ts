import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const loginGuard: CanActivateFn = (route, state) => {
  if (!isPlatformBrowser(inject(PLATFORM_ID))) return true;
  const auth = inject(AuthService);
  const router = inject(Router);
  return router.createUrlTree([auth.estaAutenticado() ? auth.rutaInicio() : '/login']);
};

