
import { Routes } from '@angular/router';

export const HISTORIA_CLINICA_ROUTES: Routes = [

  {
    path: '',
    loadComponent: () =>
      import('./historia-clinica-lista/historia-clinica-lista')
        .then(m => m.HistoriaClinicaLista)
  },

  {
    path: 'nuevo',
    loadComponent: () =>
      import('./historia-clinica-formulario/historia-clinica-formulario')
        .then(m => m.HistoriaClinicaFormulario)
  },

  {
    path: 'editar/:id',
    loadComponent: () =>
      import('./historia-clinica-formulario/historia-clinica-formulario')
        .then(m => m.HistoriaClinicaFormulario)
  },

  {
    path: ':id',
    loadComponent: () =>
      import('./historia-clinica-detalle/historia-clinica-detalle')
        .then(m => m.HistoriaClinicaDetalle)
  }

];
