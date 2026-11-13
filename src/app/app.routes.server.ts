import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    // La aplicación requiere autenticación y datos en vivo, por lo que no
    // se prerenderiza. Las rutas con parámetros (:id) se resuelven en el cliente.
    path: '**',
    renderMode: RenderMode.Client
  }
];
