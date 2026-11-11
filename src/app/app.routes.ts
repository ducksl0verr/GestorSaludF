import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { Panel } from './features/auth/panel/panel';
import { authGuard } from './core/guards/auth-guard';
import { Registrar } from './features/auth/registrar/registrar';
import { publicoGuard } from './core/guards/publico-guard';
import { roleGuard } from './core/guards/role-guard';
import { Roles } from './features/public/enums/Roles';
import { PROFESIONAL_ROUTES, USUARIO_ROUTES } from './features/admin/Pagina-Usuarios/usuario.routes';
import { PROVEEDOR_ROUTES } from './features/public/Pagina-Proveedor/proveedor.routes';

export const routes: Routes = [
<<<<<<< HEAD
<<<<<<< HEAD
    {
        path:'',
        component: PublicLayout,
        children:[
            {
                path: '',
                loadComponent:()=>
                    import('./features/public/home/home')
                .then(m=>m.Home)
            }
        ]
    },
    {
        path:'login', component: Login, canActivate: [publicoGuard]
    },
    {
        path:'registrar', component: Registrar
    },
    {
        path:'panel',
        component: Panel,
        canActivate:[authGuard]
    },
    {
        path: 'admin', 
        loadComponent: ()=> import('./layouts/admin-layout/admin-layout').then((m)=> m.AdminLayout),
        canActivate: [authGuard, roleGuard],
        data: {
            roles: [Roles.ROLE_ADMINISTRADOR]
        },
        children: [
            {
                path: '', redirectTo: 'dashboard', pathMatch: 'full'
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./features/admin/dashboard/dashboard')
                        .then((m)=> m.Dashboard),
            },
            {
                path: 'usuarios',
                children: USUARIO_ROUTES
            },
            {
                path: 'profesionales',
                children: PROFESIONAL_ROUTES
            },
            {
                path: 'configuracion',
                loadComponent: ()=> import('./features/admin/configuracion/configuracion')
                .then((m) => m.Configuracion),
            },
            {
                path: 'proveedores',
                data:{ baseProveedores: '/admin/proveedores'},
                children: PROVEEDOR_ROUTES
            }
        ],
    },
    {
        path: '**',
        redirectTo:''
    }
=======
=======
>>>>>>> 30623b6293cbab0d411683634194f821607d0436

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

<<<<<<< HEAD
>>>>>>> 187c698 (creacion de entidades completas. historia clinica, recetas y diagnostico)
=======
>>>>>>> 30623b6293cbab0d411683634194f821607d0436
];
