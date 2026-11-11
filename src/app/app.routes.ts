import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { PublicLayout } from './layouts/public-layout/public-layout';

export const routes: Routes = [

  // RUTAS PUBLICAS
  {
    path: '',
    component: PublicLayout,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/public/home/home')
            .then(m => m.Home)
      }
    ]
  },

  // LOGIN
  {
    path: 'login',
    component: Login
  },

  // RUTAS ADMINISTRADOR
  {
    path: 'admin',
    component: AdminLayout,
    children: [

      // DASHBOARD
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard')
            .then(m => m.Dashboard)
      },

      // USUARIOS
      {
        path: 'users',
        loadComponent: () =>
          import('./features/admin/usuarios/usuarios')
            .then(m => m.Usuarios)
      },

      // CONFIGURACION
      {
        path: 'configuration',
        loadComponent: () =>
          import('./features/admin/configuracion/configuracion')
            .then(m => m.Configuracion)
      },

      // PROFESIONALES
      {
        path: 'profesionales',
        loadComponent: () =>
          import('./features/profesional/components/profesional-list/profesional-list')
            .then(m => m.ProfesionalList)
      },

      {
        path: 'profesionales/form',
        loadComponent: () =>
          import('./features/profesional/components/profesional-form/profesional-form')
            .then(m => m.ProfesionalForm)
      },

      {
        path: 'profesionales/form/:id',
        loadComponent: () =>
          import('./features/profesional/components/profesional-form/profesional-form')
            .then(m => m.ProfesionalForm)
      },

      {
        path: 'profesionales/:id',
        loadComponent: () =>
          import('./features/profesional/components/profesional-detail/profesional-detail')
            .then(m => m.ProfesionalDetail)
      },

      // DIAGNOSTICOS
      {
        path: 'diagnosticos',
        loadComponent: () =>
          import('./features/profesional/diagnostico/components/diagnostico-list/diagnostico-list')
            .then(m => m.DiagnosticoList)
      },

      {
        path: 'diagnosticos/form',
        loadComponent: () =>
          import('./features/profesional/diagnostico/components/diagnostico-form/diagnostico-form')
            .then(m => m.DiagnosticoForm)
      },

      {
        path: 'diagnosticos/form/:id',
        loadComponent: () =>
          import('./features/profesional/diagnostico/components/diagnostico-form/diagnostico-form')
            .then(m => m.DiagnosticoForm)
      },

      {
        path: 'diagnosticos/:id',
        loadComponent: () =>
          import('./features/profesional/diagnostico/components/diagnostico-detail/diagnostico-detail')
            .then(m => m.DiagnosticoDetail)
      },

      // HISTORIA CLINICA
      {
        path: 'historia-clinica',
        loadComponent: () =>
          import('./features/profesional/historia-clinica/components/historia-clinica-list/historia-clinica-list')
            .then(m => m.HistoriaClinicaList)
      },

      {
        path: 'historia-clinica/form',
        loadComponent: () =>
          import('./features/profesional/historia-clinica/components/historia-clinica-form/historia-clinica-form')
            .then(m => m.HistoriaClinicaForm)
      },

      {
        path: 'historia-clinica/form/:id',
        loadComponent: () =>
          import('./features/profesional/historia-clinica/components/historia-clinica-form/historia-clinica-form')
            .then(m => m.HistoriaClinicaForm)
      },

      {
        path: 'historia-clinica/:id',
        loadComponent: () =>
          import('./features/profesional/historia-clinica/components/historia-clinica-detail/historia-clinica-detail')
            .then(m => m.HistoriaClinicaDetail)
      },

      // RECETAS
      {
        path: 'recetas',
        loadComponent: () =>
          import('./features/profesional/recetas/components/recetas-list/recetas-list')
            .then(m => m.RecetasList)
      },

      {
        path: 'recetas/form',
        loadComponent: () =>
          import('./features/profesional/recetas/components/recetas-form/recetas-form')
            .then(m => m.RecetaForm)
      },

      {
        path: 'recetas/form/:id',
        loadComponent: () =>
          import('./features/profesional/recetas/components/recetas-form/recetas-form')
            .then(m => m.RecetaForm)
      },

      {
        path: 'recetas/:id',
        loadComponent: () =>
          import('./features/profesional/recetas/components/recetas-detail/recetas-detail')
            .then(m => m.RecetaDetail)
      }

    ]
  },

  // RUTA NO ENCONTRADA
  {
    path: '**',
    redirectTo: ''
  }

];
