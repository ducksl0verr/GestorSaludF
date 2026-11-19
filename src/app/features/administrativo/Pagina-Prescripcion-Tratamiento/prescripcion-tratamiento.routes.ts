import { Routes } from '@angular/router';

export const PRESCRIPCIONES_ROUTES: Routes = [
    // Listado de prescripciones de un paciente
    {
        path: ':id',
        loadComponent: () =>
            import('./prescripcion-tratamiento-lista/prescripcion-tratamiento-lista')
                .then(m => m.PrescripcionTratamientoLista)
    }
];
