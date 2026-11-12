import { Routes } from '@angular/router';

export const GASTO_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./gasto-lista/gasto-lista')
            .then(m => m.GastoLista)
    },
    {
        path: 'nuevo',
        loadComponent: () => import('./gasto-formulario/gasto-formulario')
            .then(m => m.GastoFormulario)
    },
    {
        path: 'editar/:id',
        loadComponent: () => import('./gasto-formulario/gasto-formulario')
            .then(m => m.GastoFormulario)
    },
    {
        path: ':id',
        loadComponent: () => import('./gasto-detalles/gasto-detalles')
            .then(m => m.GastoDetalles)
    }
];
