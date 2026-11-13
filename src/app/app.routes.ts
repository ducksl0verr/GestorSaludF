import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { authGuard } from './core/guards/auth-guard';
import { Registrar } from './features/auth/registrar/registrar';
import { publicoGuard } from './core/guards/publico-guard';
import { roleGuard } from './core/guards/role-guard';
import { Roles } from './features/auth/enums/Roles';
import { PROFESIONAL_ROUTES, USUARIO_ROUTES } from './features/admin/Pagina-Usuarios/usuario.routes';
import { PROVEEDOR_ROUTES } from './features/public/Pagina-Proveedor/proveedor.routes';
import { PACIENTE_ROUTES } from './features/administrativo/Pagina-Paciente/paciente.routes';
import { TURNO_ROUTES } from './features/administrativo/Pagina-Turno/turno.routes';
import { OBRAS_SOCIALES_ROUTES } from './features/public/Pagina-ObraSocial/obras_sociales.routes';
import { TRATAMIENTOS_ROUTES } from './features/public/Pagina-Tratamientos/tratamiento.routes';
import { MEDICAMENTOS_ROUTES } from './features/public/Pagina-Medicamento/medicamentos.route';
import { OlvideContrasena } from './core/RecuperacionContraseña/olvide-contrasena/olvide-contrasena';
import { RestablecerContrasena } from './core/RecuperacionContraseña/restablecer-contrasena/restablecer-contrasena';
import { CONSULTORIO_ROUTES } from './features/administrativo/Pagina-consultorios/consultorios.routes';
import { SALAS_INTERNACION_ROUTES } from './features/administrativo/Pagina-Salas-de-internacion/sala-internacion.routes';
import { QUIROFANO_ROUTES } from './features/administrativo/Pagina-quirofanos/quirofano.routes';
import { PRESCRIPCIONES_ROUTES } from './features/administrativo/Pagina-Prescripcion-Tratamiento/prescripcion-tratamiento.routes';
import { PAGO_ROUTES } from './features/administrativo/Pagina-Pago/pago.routes';
import { GASTO_ROUTES } from './features/administrativo/Pagina-Gasto/gasto.routes';
import { FACTURA_ROUTES } from './features/administrativo/Pagina-Factura/factura.routes';
import { RECETA_ROUTES } from './features/profesional/Pagina-Receta/receta.routes';
import { HISTORIA_CLINICA_ROUTES } from './features/profesional/Pagina-HistoriaClinica/historia-clinica.routes';
import { DIAGNOSTICO_ROUTES } from './features/profesional/Pagina-Diagnostico/diagnostico.routes';

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
        path: 'olvide-contrasena', component: OlvideContrasena,
        canActivate: [publicoGuard]
    },
    {
        path: 'restablecer',
        component: RestablecerContrasena
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
            },
            {
                path: 'prescripciones',
                children: PRESCRIPCIONES_ROUTES
            },
            {
                path: 'pagos',
                children: PAGO_ROUTES
            },
            {
                path: 'gastos',
                children: GASTO_ROUTES
            },
            {
                path: 'facturas',
                children: FACTURA_ROUTES
            }
        ],
    },

    {
        path: 'administrativo',
        loadComponent: ()=> import('./layouts/administrativo-layout/administrativo-layout').then((m)=> m.AdministrativoLayout),
        canActivate: [authGuard, roleGuard],
        data: {
            roles: [Roles.ROLE_ADMINISTRATIVO],
            base: '/administrativo'
        },

        children: [
            {
                path: '', redirectTo: 'consultorios', pathMatch: 'full'
            },
            {
                path: 'pacientes',
                children: PACIENTE_ROUTES
            },
            {
                path: 'prescripciones',
                children: PRESCRIPCIONES_ROUTES
            },
            {
                path: 'quirofanos',
                children: QUIROFANO_ROUTES
            },
            {
                path: 'turnos',
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
            {
                path: 'pagos',
                children: PAGO_ROUTES
            },
            {
                path: 'gastos',
                children: GASTO_ROUTES
            },
            {
                path: 'facturas',
                children: FACTURA_ROUTES
            }
            
        ]
    }, 
    {
      path: 'profesional',
      loadComponent: ()=> import('./layouts/prof-layouts/prof-layouts').then(m=>m.ProfLayouts),
        canActivate: [authGuard, roleGuard],
        data: {
          roles: [Roles.ROLE_PROFESIONAL],
          base: '/profesional'
        },
        children: [
          {
            path: '', redirectTo: 'pacientes', pathMatch: 'full'
          },
          {
            path:'diagnosticos', children:DIAGNOSTICO_ROUTES
          },
          {
            path:'historiasclinicas', children:HISTORIA_CLINICA_ROUTES
          },
          {
            path:'recetas', children:RECETA_ROUTES
          },
          {
                path: 'medicamentos',
                children: MEDICAMENTOS_ROUTES
          },
          {
                path: 'pacientes',
                children: PACIENTE_ROUTES
          },
            {
                path: 'tratamientos',
                children: TRATAMIENTOS_ROUTES
            }
        ]
    },
    {
      path: '**', redirectTo: ''
    }
]