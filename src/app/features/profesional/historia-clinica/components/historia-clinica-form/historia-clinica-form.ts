import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import {
  form,
  FormField,
  required,
  minLength,
  maxLength
} from '@angular/forms/signals';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HistoriaClinica } from '../../model/historia-clinica';
import { HistoriaClinicaService } from '../../services/historia-clinica';

@Component({
  selector: 'app-historia-clinica-form',
  imports: [CommonModule, FormField, RouterModule],
  templateUrl: './historia-clinica-form.html',
  styleUrl: './historia-clinica-form.css'
})
export class HistoriaClinicaForm implements OnInit {

  id: string | null = null;

  historiaClinicaModel = signal<Omit<HistoriaClinica, 'id'>>({
    fecha: '',
    observaciones: '',
    evolucion: ''
  });

  historiaClinicaForm = form(this.historiaClinicaModel, (campo) => {

    required(campo.fecha, {
      message: 'La fecha es obligatoria.'
    });

    required(campo.observaciones, {
      message: 'Las observaciones son obligatorias.'
    });

    minLength(campo.observaciones, 5, {
      message: 'Las observaciones deben tener al menos 5 caracteres.'
    });

    maxLength(campo.observaciones, 300, {
      message: 'Las observaciones no pueden superar los 300 caracteres.'
    });

    required(campo.evolucion, {
      message: 'La evolución es obligatoria.'
    });

    minLength(campo.evolucion, 5, {
      message: 'La evolución debe tener al menos 5 caracteres.'
    });

    maxLength(campo.evolucion, 500, {
      message: 'La evolución no puede superar los 500 caracteres.'
    });

  });

  constructor(
    private historiaClinicaService: HistoriaClinicaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id) {

      this.historiaClinicaService.getHistoria(this.id).subscribe({
        next: (data) => {

          this.historiaClinicaModel.set({
            fecha: data.fecha,
            observaciones: data.observaciones,
            evolucion: data.evolucion
          });

        },
        error: () => {
          alert('No se pudo cargar la historia clínica.');
        }
      });

    }
  }

  onSubmit(event: Event): void {

    event.preventDefault();

    this.historiaClinicaForm().markAsTouched();

    if (this.historiaClinicaForm().invalid()) {

      const errores = this.historiaClinicaForm()
        .errorSummary()
        .map(error => error.message)
        .filter(Boolean);

      alert('Corregí los siguientes errores:\n\n' + errores.join('\n'));

      return;
    }

    const historiaData = this.historiaClinicaModel();

    if (this.id) {

      const id = this.id;

      const historiaClinica: HistoriaClinica = {
        id: id,
        ...historiaData
      };

      this.historiaClinicaService.putHistoria(historiaClinica).subscribe({
        next: () => {
          alert('Historia clínica actualizada correctamente.');
          this.router.navigate(['/admin/historia-clinica', id]);
        },
        error: () => {
          alert('Error al actualizar la historia clínica.');
        }
      });

    } else {

      this.historiaClinicaService.postHistoria(historiaData).subscribe({
        next: (nueva) => {
          alert('Historia clínica registrada correctamente.');
          this.router.navigate(['/admin/historia-clinica', nueva.id]);
        },
        error: () => {
          alert('Error al registrar la historia clínica.');
        }
      });

    }
  }

  cancelar(): void {
    this.router.navigate(['/admin/historia-clinica']);
  }

}
