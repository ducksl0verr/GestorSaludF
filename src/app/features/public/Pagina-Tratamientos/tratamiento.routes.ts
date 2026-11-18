import { Routes } from "@angular/router";

export const TRATAMIENTOS_ROUTES: Routes =[
    {
        path: '',
        loadComponent: ()=>
            import('./tratamiento-lista/tratamiento-lista')
                .then(m => m.TratamientoLista)
    },
    {
        path: 'nuevo',
        loadComponent: ()=>
            import('./tratamiento-formulario/tratamiento-formulario')
                .then(m=> m.TratamientoFormulario)
    },
    {
        path: 'editar/:id',
        loadComponent: () =>
            import('./tratamiento-formulario/tratamiento-formulario')
                .then(m => m.TratamientoFormulario)
    }
]