import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HistoriaClinicaService } from '../services/historia-clinica-services';
import { HistoriaClinicaNueva } from '../model/historia-clinica';
import { form, FormField, maxLength, minLength, required } from '@angular/forms/signals';
import { CommonEngine } from '@angular/ssr/node';
import { CommonModule } from '@angular/common';

@Component({
  imports: [FormField,CommonModule,RouterModule],
  selector: 'app-historia-clinica-formulario',
  styleUrl: './historia-clinica-formulario.css',
  templateUrl: './historia-clinica-formulario.html',
})export class HistoriaClinicaFormulario implements OnInit {

  historiaClinicaId?: number;

  private route = inject(ActivatedRoute);
  private hService = inject(HistoriaClinicaService);
  private router = inject(Router);

  private base = this.route.snapshot.data['baseHistoriasClinicas'];

  historiaClinicaModel = signal<HistoriaClinicaNueva>({
    fecha: '',
    observaciones: '',
    evolucion: '',
    id_paciente: 0,
    id_profesional: 0,
    ids_diagnosticos: []
  });

  historiaClinicaForm = form(this.historiaClinicaModel, (campo) => {

    required(campo.fecha, {
      message: 'La fecha es obligatoria.'
    });

    required(campo.observaciones, {
      message: 'Las observaciones son obligatorias.'
    });

    minLength(campo.observaciones, 3, {
      message: 'Las observaciones deben tener al menos 3 caracteres.'
    });

    maxLength(campo.observaciones, 500, {
      message: 'Las observaciones no pueden superar los 500 caracteres.'
    });

    required(campo.evolucion, {
      message: 'La evolución es obligatoria.'
    });

    minLength(campo.evolucion, 3, {
      message: 'La evolución debe tener al menos 3 caracteres.'
    });

  });

  cargando = signal(false);
  error = signal('');

  diagnosticoId = signal(0);

  agregarDiagnostico(): void {
    const id = this.diagnosticoId();

    if (id <= 0) return;

    this.historiaClinicaModel.update(historia => ({
      ...historia,
      ids_diagnosticos: [
        ...historia.ids_diagnosticos,
        id
      ]
    }));

    this.diagnosticoId.set(0);
  }

  eliminarDiagnostico(index: number): void {
    this.historiaClinicaModel.update(historia => ({
      ...historia,
      ids_diagnosticos: historia.ids_diagnosticos.filter(
        (_, i) => i !== index
      )
    }));
  }

  ngOnInit(): void {

    const id = this.route.snapshot.params['id'];

    if (id) {
      this.historiaClinicaId = Number(id);

      this.hService.getHistoriaClinica(this.historiaClinicaId)
        .subscribe({
          next: (data) => {
            this.historiaClinicaModel.set({
              fecha: data.fecha,
              observaciones: data.observaciones,
              evolucion: data.evolucion,
              id_paciente: data.id_paciente,
              id_profesional: data.id_profesional,
              ids_diagnosticos: data.diagnosticos.map(d => d.id)
            });
          },
          error: (e) => {
            this.error.set(
              e.error?.message || 'No se pudo cargar la historia clínica.'
            );
          }
        });
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    if (this.historiaClinicaForm().invalid()) {
      this.historiaClinicaForm().markAsTouched();
      return;
    }

    const historiaData = this.historiaClinicaModel();

    this.cargando.set(true);
    this.error.set('');

    if (this.historiaClinicaId) {

      this.hService.actualizarHistoriaClinica(
        this.historiaClinicaId,
        {
          observaciones: historiaData.observaciones,
          evolucion: historiaData.evolucion
        }
      ).subscribe({
        next: () => {
          alert('Historia clínica actualizada correctamente.');
          this.router.navigate([this.base]);
        },
        error: (e) => {
          this.error.set(
            e.error?.message || 'No se pudo actualizar la historia clínica.'
          );
          this.cargando.set(false);
        }
      });

    } else {

      this.hService.guardarHistoriaClinica(historiaData).subscribe({
        next: () => {
          alert('Historia clínica guardada correctamente.');
          this.router.navigate([this.base]);
        },
        error: (e) => {
          this.error.set(
            e.error?.message || 'No se pudo guardar la historia clínica.'
          );
          this.cargando.set(false);
        }
      });

    }
  }

}


