import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authS = inject(AuthService);

  const token = localStorage.getItem('token');

  if(!token){
    return router.createUrlTree(['/login']);
  }

  return authS.validarToken().pipe(
    map(()=>true),
    catchError(()=>{
      localStorage.removeItem('token');
      return of(router.createUrlTree(['/login']));
    })
  );

};
