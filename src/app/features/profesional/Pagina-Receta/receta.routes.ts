
import { Routes } from '@angular/router';

export const RECETA_ROUTES: Routes = [

  {
    path: '',
    loadComponent: () =>
      import('./receta-lista/receta-lista')
        .then(m => m.RecetaLista)
  },

  {
    path: 'nuevo',
    loadComponent: () =>
      import('./receta-formulario/receta-formulario')
        .then(m => m.RecetaFormulario)
  },

  {
    path: 'editar/:id',
    loadComponent: () =>
      import('./receta-formulario/receta-formulario')
        .then(m => m.RecetaFormulario)
  },

  {
    path: ':id',
    loadComponent: () =>
      import('./receta-detalle/receta-detalle')
        .then(m => m.RecetaDetalle)
  }

];
