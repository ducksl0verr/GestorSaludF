import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';

export const publicoGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.estaAutenticado() && auth.getRol() ? router.createUrlTree([auth.rutaInicio()]) : true;
};
