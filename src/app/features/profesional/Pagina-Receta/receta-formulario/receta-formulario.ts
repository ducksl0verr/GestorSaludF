
import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { FormField, form, required, min, applyEach } from '@angular/forms/signals';

import { RecetaService } from '../services/receta-services';
import { RecetaNueva } from '../model/receta';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-receta-form',
  imports: [FormField, RouterModule,CommonModule],
  templateUrl: './receta-formulario.html',
  styleUrl: './receta-formulario.css'
})
export class RecetaFormulario {

  private recetasService = inject(RecetaService);
  private router = inject(Router);

  cargando = signal(false);
  error = signal('');

  modelo = signal<RecetaNueva>({
    id_paciente: 0,
    id_profesional: 0,
    detalles: [
      {
        dosis: '',
        frecuencia: '',
        cantidad: 1,
        id_medicamento: 0
      }
    ]
  });

  formulario = form(this.modelo, (schema) => {

    min(schema.id_paciente, 1);
    min(schema.id_profesional, 1);

    applyEach(schema.detalles, (detalle) => {
      required(detalle.dosis);
      required(detalle.frecuencia);
      min(detalle.cantidad, 1);
      min(detalle.id_medicamento, 1);
    });

  });

  agregarDetalle(): void {

    this.modelo.update(datos => ({
      ...datos,
      detalles: [
        ...datos.detalles,
        {
          dosis: '',
          frecuencia: '',
          cantidad: 1,
          id_medicamento: 0
        }
      ]
    }));

  }

  eliminarDetalle(index: number): void {

    if (this.modelo().detalles.length > 1) {

      this.modelo.update(datos => ({
        ...datos,
        detalles: datos.detalles.filter((_, i) => i !== index)
      }));

    }

  }

  guardar(event: Event): void {

    event.preventDefault();

    if (this.formulario().invalid()) {
      return;
    }

    const receta: RecetaNueva = this.modelo();

    this.cargando.set(true);
    this.error.set('');

    this.recetasService.guardarReceta(receta).subscribe({

      next: () => {
        this.cargando.set(false);
        this.router.navigate(['/recetas']);
      },

      error: (err) => {
        console.error('Error al guardar receta', err);
        this.error.set('No se pudo guardar la receta.');
        this.cargando.set(false);
      }

    });

  }

  cancelar(): void {
    this.router.navigate(['/recetas']);
  }

}
