import { Routes } from '@angular/router';

export const QUIROFANO_ROUTES: Routes = [

    {
        path: '',
        loadComponent: () => import('./quirofano-lista/quirofano-lista')
            .then(m => m.QuirofanoLista)
    },
    {
        path: 'nuevo',
        loadComponent: () => import('./quirofano-formulario/quirofano-formulario')
            .then(m => m.QuirofanoFormulario)
    },
    {
        path: 'editar/:id',
        loadComponent: () => import('./quirofano-formulario/quirofano-formulario')
            .then(m => m.QuirofanoFormulario)
    },
    {
        path: ':id',
        loadComponent: () => import('./quirofano-detalle/quirofano-detalle')
            .then(m => m.QuirofanoDetalle)
    }

];