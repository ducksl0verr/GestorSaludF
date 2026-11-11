import { Routes } from "@angular/router";

export const PAGO_ROUTES: Routes=[
     {
        path: '',
        loadComponent: ()=>
            import('./pago-lista/pago-lista')
                .then(m => m.PagoLista)
    },
    {
        path: 'nuevo',
        loadComponent: ()=>
            import('./pago-formulario/pago-formulario')
                .then(m=> m.PagoFormulario)
    },
    {
        path: ':id',
        loadComponent: ()=>
            import('./pago-detalle/pago-detalle')
                .then(m=>m.PagoDetalle)
    }
]