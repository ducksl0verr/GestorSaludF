import { Routes } from "@angular/router";

export const MEDICAMENTOS_ROUTES: Routes =[
    {
        path: '',
        loadComponent: ()=>
            import('./mediacamento-lista/mediacamento-lista')
                .then(m => m.MediacamentoLista)
    },
    {
        path: 'nuevo',
        loadComponent: ()=>
            import('./mediacamento-formulario/mediacamento-formulario')
                .then(m=> m.MediacamentoFormulario)
    },
    {
        path: 'editar/:id',
        loadComponent: () =>
            import('./mediacamento-formulario/mediacamento-formulario')
                .then(m => m.MediacamentoFormulario)
    },
    {
        path: ':id',
        loadComponent: ()=>
            import('./mediacamento-detalle/mediacamento-detalle')
                .then(m=>m.MediacamentoDetalle)
    }
]