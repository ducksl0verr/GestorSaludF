import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth-service';

let refrescando = false;
const nuevoToken$ = new BehaviorSubject<string | null>(null);

const esRutaAuth = (url: string) => url.includes('/api/auth');

const conToken = (req: HttpRequest<unknown>, token: string | null)=>
  token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}`}}) : req;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (esRutaAuth(req.url)){
    return next(req);
  }

  return next(conToken(req, auth.getAccessToken())).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401){
        return throwError(()=> error);
      }
      if (!auth.getRefreshToken()){
        cerrarSesion(auth, router);
        return throwError(()=>error);
      }
      return manejar401(req, next, auth, router);
    }),
  );
};

function manejar401(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  auth: AuthService,
  router: Router,
) {
  if(!refrescando){
    refrescando= true;
    nuevoToken$.next(null);

    return auth.refrescarToken().pipe(
      catchError((err)=>{
        refrescando=false;
        nuevoToken$.next(''); //avisa a los request que etsn en espera q fallo
        cerrarSesion(auth, router);
        return throwError(()=>err);
      }),
      switchMap((res)=>{
        refrescando = false;
        nuevoToken$.next(res.accessToken);
        return next(conToken(req, res.accessToken));
      }),
    );
  }

  //si ya hay un refresh en curso, esperar el resutlado y reintentar
  return nuevoToken$.pipe(
    filter((t)=> t !== null),
    take(1),
    switchMap((t)=>
    t
      ? next(conToken(req, t))
      : throwError(()=> new HttpErrorResponse({ status: 401 })),
  ),
 );
}

function cerrarSesion(auth: AuthService, router: Router){
  auth.cerrarSesion();
  router.navigate(['/login']);
}
