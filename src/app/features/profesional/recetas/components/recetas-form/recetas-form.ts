
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  form,
  FormField,
  required
} from '@angular/forms/signals';

import { Receta } from '../../model/receta';
import { RecetaService } from '../../services/receta';

@Component({
  selector: 'app-receta-form',
  imports: [CommonModule, RouterModule, FormField],
  templateUrl: './recetas-form.html',
  styleUrl: './recetas-form.css'
})
export class RecetaForm implements OnInit {

  id: string | null = null;

  recetaModel = signal<Omit<Receta, 'id'>>({
    fecha: ''
  });

  recetaForm = form(this.recetaModel, (campo) => {
    required(campo.fecha, {
      message: 'La fecha es obligatoria.'
    });
  });

  constructor(
    private recetaService: RecetaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id) {
      this.recetaService.getReceta(this.id).subscribe({
        next: (data) => {
          this.recetaModel.set({
            fecha: data.fecha
          });
        },
        error: () => {
          alert('Error al obtener la receta.');
        }
      });
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    this.recetaForm().markAsTouched();

    if (this.recetaForm().invalid()) {
      alert('Complete correctamente los campos.');
      return;
    }

    const receta: Receta = {
      ...this.recetaModel()
    };

    if (this.id) {
      receta.id = this.id;

      this.recetaService.putReceta(receta).subscribe({
        next: () => {
          alert('Receta actualizada correctamente.');
          this.router.navigate(['/admin/recetas']);
        },
        error: () => {
          alert('Error al actualizar la receta.');
        }
      });

    } else {
      this.recetaService.postReceta(receta).subscribe({
        next: () => {
          alert('Receta registrada correctamente.');
          this.router.navigate(['/admin/recetas']);
        },
        error: () => {
          alert('Error al registrar la receta.');
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/admin/recetas']);
  }
}
