import { Routes } from '@angular/router';
export const PROVEEDOR_ROUTES: Routes = [
    {
        path: '',
        loadComponent: ()=>
            import('./proveedor-lista/proveedor-lista')
                .then(m => m.ProveedorLista)
    },
    {
        path: 'nuevo',
        loadComponent: ()=>
            import('./proveedor-formulario/proveedor-formulario')
                .then(m=> m.ProveedorFormulario)
    },
    {
    path: 'editar/:id',
    loadComponent: () =>
      import('./proveedor-formulario/proveedor-formulario')
        .then(m => m.ProveedorFormulario)
    },
    {
        path: ':id',
        loadComponent: ()=>
            import('./proveedor-detalle/proveedor-detalle')
                .then(m=>m.ProveedorDetalle)
    }
];