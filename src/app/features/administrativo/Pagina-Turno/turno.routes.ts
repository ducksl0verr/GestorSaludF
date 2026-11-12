import { Routes } from '@angular/router';

export const TURNO_ROUTES: Routes = [
  // Lista de turnos
  {
    path: '',
    loadComponent: () =>
      import('./turno-lista/turno-lista')
        .then(m => m.TurnoLista)
  },

  // Crear turno
  {
    path: 'nuevo',
    loadComponent: () =>
      import('./turno-formulario/turno-formulario')
        .then(m => m.TurnoFormulario)
  },

  // Editar turno
  {
    path: 'editar/:id',
    loadComponent: () =>
      import('./turno-formulario/turno-formulario')
        .then(m => m.TurnoFormulario)
  },

  // Detalles de turno
  {
    path: ':id',
    loadComponent: () =>
      import('./turno-detalles/turno-detalles')
        .then(m => m.TurnoDetalles)
  }
];
