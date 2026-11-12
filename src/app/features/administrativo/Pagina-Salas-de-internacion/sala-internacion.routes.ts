import { Routes } from '@angular/router';

import { SalaInternacionLista } from './sala-internacion-lista/sala-internacion-lista';
import { SalaInternacionFormulario } from './sala-internacion-formulario/sala-internacion-formulario';
import { SalaInternacionDetalle } from './sala-internacion-detalle/sala-internacion-detalle';

export const SALAS_INTERNACION_ROUTES: Routes = [
    {
        path: '',
        component: SalaInternacionLista
    },
    {
        path: 'nuevo',
        component: SalaInternacionFormulario
    },
    {
        path: 'editar/:id',
        component: SalaInternacionFormulario
    },
    {
        path: ':id',
        component: SalaInternacionDetalle
    }
];