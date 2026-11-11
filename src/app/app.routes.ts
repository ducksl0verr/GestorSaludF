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
      path: 'profesional',
      loadComponent: ()=> import('./layouts/prof-layouts/prof-layouts')
        .then(m=>m.ProfLayouts),
        canActivate: [authGuard, roleGuard],
        data: {
          roles: [Roles.ROLE_PROFESIONAL]
        },
        children: [
      // DIAGNOSTICOS
            {
              path: 'diagnosticos',
              loadComponent: () =>
                import('./features/profesional/Pagina-Diagnostico/components/diagnostico-lista/diagnostico-list')
                  .then(m => m.DiagnosticoList)
            },

            {
              path: 'diagnosticos/form',
              loadComponent: () =>
                import('./features/profesional/Pagina-Diagnostico/components/diagnostico-formulario/diagnostico-form')
                  .then(m => m.DiagnosticoForm)
            },

            {
              path: 'diagnosticos/form/:id',
              loadComponent: () =>
                import('./features/profesional/Pagina-Diagnostico/components/diagnostico-formulario/diagnostico-form')
                  .then(m => m.DiagnosticoForm)
            },

            {
              path: 'diagnosticos/:id',
              loadComponent: () =>
                import('./features/profesional/Pagina-Diagnostico/components/diagnostico-detalle/diagnostico-detalle')
                  .then(m => m.DiagnosticoDetalle)
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
    {
        path: '**',
        redirectTo:''
    }
];