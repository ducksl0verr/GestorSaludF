import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { isPlatformBrowser } from '@angular/common';

//Ya nose llama al back para validar, solo necesitamos chequear q
// se haya iniciado sesión y si el token vencio. Si lo hizo, el intenceptor lo va a refrescar
//con el primer request.
export const authGuard: CanActivateFn = () => {
  if (!isPlatformBrowser(inject(PLATFORM_ID))) return true;
  
  const router = inject(Router);
  const authS = inject(AuthService);

  return authS.estaAutenticado() ? true : router.createUrlTree(['/login']);
};
