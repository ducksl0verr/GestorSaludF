import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { AdministrativeLayout } from './layouts/administrative-layout/administrative-layout';

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
