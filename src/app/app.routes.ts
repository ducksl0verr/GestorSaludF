import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { PublicLayout } from './layouts/public-layout/public-layout';

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
        path:'login', component: Login
    },
    {
        path: 'admin', component: AdminLayout,
        children:[ //declaramos que componentes serán hijos del layout
            {
                path:'dashboard', 
                loadComponent: () => //carga perezosa
                    import('./features/admin/dashboard/dashboard')
                .then(m=>m.Dashboard)
            },
            {
                path:'users', 
                loadComponent: () => 
                    import('./features/admin/usuarios/usuarios')
                .then(m=>m.Usuarios)
            },
            {
                path:'configuration',
                loadComponent: ()=>
                    import('./features/admin/configuracion/configuracion')
                .then(m=>m.Configuracion)
            }
        ]
    },
    {
        path: '**',
        redirectTo:''
    }
];
