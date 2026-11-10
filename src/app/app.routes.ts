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
            }
        ],
    },

    {
        path: 'administrativo',
        loadComponent: ()=> import('./layouts/administrativo-layout/administrativo-layout').then((m)=> m.AdministrativoLayout),
        canActivate: [authGuard, roleGuard],
        data: {
            roles: [Roles.ROLE_ADMINISTRATIVO]
        },

        children: [
            {
                path: 'consultorios',
                loadComponent: () =>
                    import('./features/administrativo/consultorios/consultorios')
                .then(m=>m.Consultorios)
            },
            {
                path: '', redirectTo: 'consultorios', pathMatch: 'full'
            },
            {
                path: 'paciente',
                loadComponent: () =>
                    import('./features/administrativo/paciente/paciente')
                .then(m=>m.Paciente)
            },
            {
                path: 'sala',
                loadComponent: () =>
                    import('./features/administrativo/sala/sala')
                .then(m=>m.Sala)
            },
            {
                path: 'turno',
                loadComponent: () =>
                    import('./features/administrativo/turno/turno')
                .then(m=>m.Turno)
            }
            
        ]
    }, 
    {
        path: '**',
        redirectTo:''
    }
];
