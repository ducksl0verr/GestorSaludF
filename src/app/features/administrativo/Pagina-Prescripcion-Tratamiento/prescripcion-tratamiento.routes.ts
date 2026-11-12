import { Routes } from '@angular/router';

export const PRESCRIPCIONES_ROUTES: Routes = [
    // Nueva prescripción para un paciente
    {
        path: ':id/nueva',
        loadComponent: () =>
            import('./prescripcion-tratamiento-formulario/prescripcion-tratamiento-formulario')
                .then(m => m.PrescripcionTratamientoFormulario)
    },

    // Listado de prescripciones de un paciente
    {
        path: ':id',
        loadComponent: () =>
            import('./prescripcion-tratamiento-lista/prescripcion-tratamiento-lista')
                .then(m => m.PrescripcionTratamientoLista)
    }
];
