import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { AdministrativeLayout } from './layouts/administrative-layout/administrative-layout';
import { Panel } from './features/auth/panel/panel';
import { authGuard } from './core/guards/auth-guard';
import { Registrar } from './features/auth/registrar/registrar';
import { publicoGuard } from './core/guards/publico-guard';
import { roleGuard } from './core/guards/role-guard';
import { Roles } from './features/public/enums/Roles';

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
                loadComponent: ()=> import('./features/admin/usuarios/usuarios')
                .then((m) => m.Usuarios),
            },
            {
                path: 'usuarios/nuevo',
                loadComponent: ()=> import('./features/auth/registrar/registrar')
                .then((m) => m.Registrar),
            },
            {
                path: 'configuracion',
                loadComponent: ()=> import('./features/admin/configuracion/configuracion')
                .then((m) => m.Configuracion),
            }
        ],
    },

    {
        path: 'administrative', component: AdministrativeLayout,
        children: [
            {
                path: 'consulting-rooms',
                loadComponent: () =>
                    import('./features/administrative/consulting-rooms/consulting-rooms')
                .then(m=>m.ConsultingRooms)
            },
            {
                path: 'patient',
                loadComponent: () =>
                    import('./features/administrative/patient/patient')
                .then(m=>m.Patient)
            },
            {
                path: 'room',
                loadComponent: () =>
                    import('./features/administrative/room/room')
                .then(m=>m.Room)
            },
            {
                path: 'shifts',
                loadComponent: () =>
                    import('./features/administrative/shifts/shifts')
                .then(m=>m.Shifts)
            }
        ]
    },
    {
        path: '**',
        redirectTo:''
    }
];
