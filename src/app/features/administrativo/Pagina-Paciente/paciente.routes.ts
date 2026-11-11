import { Routes } from '@angular/router';

export const PACIENTE_ROUTES: Routes = [
  // Lista de pacientes
  {
    path: '',
    loadComponent: () =>
      import('./paciente-lista/paciente-lista')
        .then(m => m.PacienteLista)
  },

  // Crear paciente
  {
    path: 'nuevo',
    loadComponent: () =>
      import('./paciente-formulario/paciente-formulario')
        .then(m => m.PacienteFormulario)
  },

  // Editar paciente
  {
    path: 'editar/:id',
    loadComponent: () =>
      import('./paciente-formulario/paciente-formulario')
        .then(m => m.PacienteFormulario)
  },

  // Detalles de paciente
  {
    path: ':id',
    loadComponent: () =>
      import('./paciente-detalle/paciente-detalle')
        .then(m => m.PacienteDetalle)
  }
];
