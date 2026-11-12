import { Routes } from '@angular/router';

export const DIAGNOSTICO_ROUTES: Routes = [

    {
        path: '',
        loadComponent: () =>
            import('./diagnostico-lista/diagnostico-lista')
                .then(m => m.DiagnosticoLista)
    },
    {
        path: 'nuevo',
        loadComponent: () =>
            import('./diagnostico-formulario/diagnostico-formulario')
                .then(m => m.DiagnosticoFormulario)
    },
    {
        path: 'editar/:id',
        loadComponent: () =>
            import('./diagnostico-formulario/diagnostico-formulario')
                .then(m => m.DiagnosticoFormulario)
    },
    {
        path: ':id',
        loadComponent: () =>
            import('./diagnostico-detalle/diagnostico-detalle')
                .then(m => m.DiagnosticoDetalle)
    }

];