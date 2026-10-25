import { Routes } from '@angular/router';
import { Home } from './features/public/home/home';
import { Login } from './features/auth/login/login';
import { Information } from './features/public/information/information';
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
                path:'usuarios', 
                loadComponent: () => 
                    import('./features/admin/usuarios/usuarios')
                .then(m=>m.Usuarios)
            }
        ]
    },
    {
        path: '**',
        redirectTo:''
    }
];
