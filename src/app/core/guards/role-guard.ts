import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { Roles } from '../../features/public/enums/Roles';
import { isPlatformBrowser } from '@angular/common';

export const roleGuard: CanActivateFn = (route, state) => {
  if (!isPlatformBrowser(inject(PLATFORM_ID))) return true;

  const auth = inject(AuthService);
  const router= inject(Router);
  const permitidos = route.data['roles'] as Roles [] | undefined;
  const rol = auth.getRol();
  
  if(!rol) return router.createUrlTree(['/login']);
  if (!permitidos || permitidos.includes(rol)) return true;
  return router.createUrlTree([auth.rutaInicio()]);
};
