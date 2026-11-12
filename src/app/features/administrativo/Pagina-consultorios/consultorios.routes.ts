import { Routes } from '@angular/router';

export const CONSULTORIO_ROUTES: Routes = [

    {
        path: '',
        loadComponent: () => import('./consultorio-lista/consultorio-lista')
            .then(m => m.ConsultorioLista)
    },
    {
        path: 'nuevo',
        loadComponent: () => import('./consultorio-formulario/consultorio-formulario')
            .then(m => m.ConsultorioFormulario)
    },
    {
        path: 'editar/:id',
        loadComponent: () => import('./consultorio-formulario/consultorio-formulario')
            .then(m => m.ConsultorioFormulario)
    },
    {
        path: 'detalle/:id',
        loadComponent: () => import('./consultorio-detalle/consultorio-detalle')
            .then(m => m.ConsultorioDetalle)
    }

];