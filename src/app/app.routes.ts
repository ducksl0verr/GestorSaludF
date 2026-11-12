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
import { PACIENTE_ROUTES } from './features/administrativo/Pagina-Paciente/paciente.routes';
import { TURNO_ROUTES } from './features/administrativo/Pagina-Turno/turno.routes';
import { OBRAS_SOCIALES_ROUTES } from './features/public/Pagina-ObraSocial/obras_sociales.routes';
import { TRATAMIENTOS_ROUTES } from './features/public/Pagina-Tratamientos/tratamiento.routes';
import { MEDICAMENTOS_ROUTES } from './features/public/Pagina-Medicamento/medicamentos.route';
import { QUIROFANO_ROUTES } from './features/administrativo/Pagina-quirofanos/quirofano.routes';
import { CONSULTORIO_ROUTES } from './features/administrativo/Pagina-consultorios/consultorios.routes';
import { SALAS_INTERNACION_ROUTES } from './features/administrativo/Pagina-Salas-de-internacion/sala-internacion.routes';

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
            roles: [Roles.ROLE_ADMINISTRADOR],
            base: '/admin'
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
                children: PROVEEDOR_ROUTES
            },
            {
                path:'obrasSociales',
                children: OBRAS_SOCIALES_ROUTES
            },
            {
                path:'tratamientos',
                children: TRATAMIENTOS_ROUTES
            },
            {
                path: 'medicamentos',
                children: MEDICAMENTOS_ROUTES
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
                path: '', redirectTo: 'consultorios', pathMatch: 'full'
            },
            {
                path: 'paciente',
                children: PACIENTE_ROUTES
            },
            {
                path: 'prescripciones/:id/nueva',
                loadComponent: () =>
                import('./features/administrativo/Pagina-Prescripcion-Tratamiento/prescripcion-tratamiento-formulario/prescripcion-tratamiento-formulario')
                .then(m => m.PrescripcionTratamientoFormulario)
            },
            {
                path: 'prescripciones/:id',
                loadComponent: () =>
                import('./features/administrativo/Pagina-Prescripcion-Tratamiento/prescripcion-tratamiento-lista/prescripcion-tratamiento-lista')
                .then(m => m.PrescripcionTratamientoLista)
            },
            {
                path: 'quirofanos',
                children: QUIROFANO_ROUTES
            },
            {
                path: 'turno',
                children: TURNO_ROUTES
            },
            {
                path: 'consultorios',
                children: CONSULTORIO_ROUTES
            },
            {
                path: 'salas-internacion',
                children: SALAS_INTERNACION_ROUTES
            },
            
            
            
        ]
    }, 
    {
        path: '**',
        redirectTo:''
    }
];
