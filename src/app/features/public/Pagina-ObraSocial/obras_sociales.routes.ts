import { Routes } from "@angular/router";

export const OBRAS_SOCIALES_ROUTES: Routes = [
    {
        path: '',
        loadComponent: ()=>
            import('./obra-social-lista/obra-social-lista')
                .then(m => m.ObraSocialLista)
    },
    {
        path: 'nuevo',
        loadComponent: ()=>
            import('./obra-social-formulario/obra-social-formulario')
                .then(m=> m.ObraSocialFormulario)
    },
    {
        path: 'editar/:id',
        loadComponent: () =>
            import('./obra-social-formulario/obra-social-formulario')
                .then(m => m.ObraSocialFormulario)
    },
    {
        path: ':id',
        loadComponent: ()=>
            import('./obra-social-detalle/obra-social-detalle')
                .then(m=>m.ObraSocialDetalle)
    }
]