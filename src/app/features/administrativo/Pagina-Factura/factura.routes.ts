import { Routes } from '@angular/router';

export const FACTURA_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./factura-lista/factura-lista')
            .then(m => m.FacturaLista)
    },
    {
        path: 'nuevo',
        loadComponent: () => import('./factura-formulario/factura-formulario')
            .then(m => m.FacturaFormulario)
    },
    {
        path: ':id',
        loadComponent: () => import('./factura-detalles/factura-detalles')
            .then(m => m.FacturaDetalles)
    }
];
