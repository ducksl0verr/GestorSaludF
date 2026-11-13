import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HistoriaClinicaService } from '../services/historia-clinica-services';
import { DiagnosticoDeHistoriaNueva, HistoriaClinicaNueva } from '../model/historia-clinica';
import { form, FormField, maxLength, min, minLength, required, disabled } from '@angular/forms/signals';
import { CommonModule } from '@angular/common';

@Component({
  imports: [FormField,CommonModule,RouterModule],
  selector: 'app-historia-clinica-formulario',
  styleUrl: './historia-clinica-formulario.css',
  templateUrl: './historia-clinica-formulario.html',
})export class HistoriaClinicaFormulario implements OnInit {

  historiaClinicaId = signal<number | undefined>(undefined);

  private route = inject(ActivatedRoute);
  private hService = inject(HistoriaClinicaService);
  private router = inject(Router);

  private base = this.route.snapshot.data['base'];

  historiaClinicaModel = signal<HistoriaClinicaNueva>({
    fecha: '',
    observaciones: '',
    evolucion: '',
    id_paciente: 0,
    id_profesional: 0,
    ids_diagnosticos: [],
    diagnosticos: []
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

    min(campo.id_paciente, 1, {
      message: 'Debe indicar un paciente válido.'
    });

    min(campo.id_profesional, 1, {
      message: 'Debe indicar un profesional válido.'
    });

    // En edición solo se actualizan observaciones y evolución.
    disabled(campo.fecha, { when: () => !!this.historiaClinicaId() });
    disabled(campo.id_paciente, { when: () => !!this.historiaClinicaId() });
    disabled(campo.id_profesional, { when: () => !!this.historiaClinicaId() });

  });

  cargando = signal(false);
  error = signal('');

  agregarDiagnostico(): void {
    this.historiaClinicaModel.update(historia => ({
      ...historia,
      diagnosticos: [
        ...historia.diagnosticos,
        { nombre: '', descripcion: '', fechaDiagnostico: '' }
      ]
    }));
  }

  actualizarDiagnostico(
    index: number,
    campo: keyof DiagnosticoDeHistoriaNueva,
    valor: string
  ): void {
    this.historiaClinicaModel.update(historia => ({
      ...historia,
      diagnosticos: historia.diagnosticos.map((diagnostico, i) =>
        i === index ? { ...diagnostico, [campo]: valor } : diagnostico
      )
    }));
  }

  eliminarDiagnostico(index: number): void {
    this.historiaClinicaModel.update(historia => ({
      ...historia,
      diagnosticos: historia.diagnosticos.filter((_, i) => i !== index)
    }));
  }

  ngOnInit(): void {

    const id = this.route.snapshot.params['id'];

    if (id) {
      this.historiaClinicaId.set(Number(id));

      this.hService.getHistoriaClinica(this.historiaClinicaId()!)
        .subscribe({
          next: (data) => {
            this.historiaClinicaModel.set({
              fecha: data.fecha,
              observaciones: data.observaciones,
              evolucion: data.evolucion,
              id_paciente: data.id_paciente,
              id_profesional: data.id_profesional,
              ids_diagnosticos: data.diagnosticos.map(d => d.id),
              diagnosticos: []
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

    if (
      !this.historiaClinicaId() &&
      historiaData.diagnosticos.some(
        d => !d.nombre.trim() || !d.descripcion.trim() || !d.fechaDiagnostico
      )
    ) {
      this.error.set(
        'Complete el nombre, la descripción y la fecha de todos los diagnósticos.'
      );
      return;
    }

    this.cargando.set(true);
    this.error.set('');

    if (this.historiaClinicaId()) {

      this.hService.actualizarHistoriaClinica(
        this.historiaClinicaId()!,
        {
          observaciones: historiaData.observaciones,
          evolucion: historiaData.evolucion
        }
      ).subscribe({
        next: () => {
          alert('Historia clínica actualizada correctamente.');
          this.router.navigate([this.base, 'historiasclinicas']);
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
          this.router.navigate([this.base, 'historiasclinicas']);
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

  cancelar(): void {
    this.router.navigate([this.base, 'historiasclinicas']);
  }

}


