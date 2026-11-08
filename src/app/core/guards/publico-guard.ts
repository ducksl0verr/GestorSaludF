import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const publicoGuard: CanActivateFn = (route, state) => {
  if (!isPlatformBrowser(inject(PLATFORM_ID))) return true;
  
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.estaAutenticado() && auth.getRol() ? router.createUrlTree([auth.rutaInicio()]) : true;
};
