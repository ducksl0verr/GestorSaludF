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
import { PAGO_ROUTES } from './features/public/Pagina-Pago/pago.routes';

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
            },
            {
                path: 'pagos',
                data: { basePagos: '/admin/pagos',
                    baseP: '/administrativo/pagos'
                },
                children: PAGO_ROUTES
            }
        ],
    },
    {
        path: '**',
        redirectTo:''
    }
];
