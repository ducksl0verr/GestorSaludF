import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
<<<<<<< HEAD
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth-interceptor';
=======
import { HttpClient, provideHttpClient } from '@angular/common/http';
>>>>>>> 187c698 (creacion de entidades completas. historia clinica, recetas y diagnostico)

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), provideClientHydration(),
<<<<<<< HEAD
    provideHttpClient(withInterceptors([authInterceptor]))
=======
    provideHttpClient()
>>>>>>> 187c698 (creacion de entidades completas. historia clinica, recetas y diagnostico)
  ]
};
