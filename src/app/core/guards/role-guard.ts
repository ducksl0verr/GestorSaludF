import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { Router } from 'express';
import { Roles } from '../../features/public/enums/Roles';

export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router= inject(Router);
  const permitidos = route.data['roles'] as Roles [] | undefined;
  const rol = auth.getRol();
  
  if(!rol) return router.createUrlTree(['/login']);
  if (!permitidos || permitidos.includes(rol)) return true;
  return router.createUrlTree([auth.rutaInicio()]);
};
