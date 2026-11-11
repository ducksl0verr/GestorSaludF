import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
<<<<<<< HEAD
<<<<<<< HEAD
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth-interceptor';
=======
import { HttpClient, provideHttpClient } from '@angular/common/http';
>>>>>>> 187c698 (creacion de entidades completas. historia clinica, recetas y diagnostico)
=======
import { HttpClient, provideHttpClient } from '@angular/common/http';
>>>>>>> 30623b6293cbab0d411683634194f821607d0436

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), provideClientHydration(),
<<<<<<< HEAD
<<<<<<< HEAD
    provideHttpClient(withInterceptors([authInterceptor]))
=======
    provideHttpClient()
>>>>>>> 187c698 (creacion de entidades completas. historia clinica, recetas y diagnostico)
=======
    provideHttpClient()
>>>>>>> 30623b6293cbab0d411683634194f821607d0436
  ]
};
