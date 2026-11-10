
import { Routes } from '@angular/router';

export const USUARIO_ROUTES: Routes = [
  // Lista de usuarios
  {
    path: '',
    loadComponent: () =>
      import('./usuario-lista/usuario-lista')
        .then(m => m.UsuarioLista)
  },

  // Crear usuario
  {
    path: 'nuevo',
    loadComponent: () =>
      import('./usuario-formulario/usuario-formulario')
        .then(m => m.UsuarioFormulario)
  },

  // Editar usuario
  {
    path: 'editar/:id',
    loadComponent: () =>
      import('./usuario-formulario/usuario-formulario')
        .then(m => m.UsuarioFormulario)
  },

  // Detalles de usuario
  {
    path: ':id',
    loadComponent: () =>
      import('./usuario-detalle/usuario-detalle')
        .then(m => m.UsuarioDetalle)
  }
];

export const PROFESIONAL_ROUTES: Routes = [
  // Lista de profesionales
  {
    path: '',
    loadComponent: () =>
      import('./usuario-lista/usuario-lista')
        .then(m => m.UsuarioLista),
    data: { esProfesional: true }
  },

  // Crear profesional
  {
    path: 'nuevo',
    loadComponent: () =>
      import('./usuario-formulario/usuario-formulario')
        .then(m => m.UsuarioFormulario),
    data: { esProfesional: true }
  },

  // Editar profesional
  {
    path: 'editar/:id',
    loadComponent: () =>
      import('./usuario-formulario/usuario-formulario')
        .then(m => m.UsuarioFormulario),
    data: { esProfesional: true }
  },

  // Detalles del profesional
  {
    path: ':id',
    loadComponent: () =>
      import('./usuario-detalle/usuario-detalle')
        .then(m => m.UsuarioDetalle),
    data: { esProfesional: true }
  }
];
