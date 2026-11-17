import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HistoriaClinicaService } from '../services/historia-clinica-services';
import { DiagnosticoDeHistoriaNueva, HistoriaClinicaNueva } from '../model/historia-clinica';
import { form, FormField, maxLength, min, minLength, required, disabled } from '@angular/forms/signals';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../../core/services/auth-service';
import { DiagnosticoService } from '../../Pagina-Diagnostico/services/diagnostico-services';
import { Diagnostico } from '../../Pagina-Diagnostico/model/diagnostico';

@Component({
  imports: [FormField,CommonModule,RouterModule],
  selector: 'app-historia-clinica-formulario',
  styleUrl: './historia-clinica-formulario.css',
  templateUrl: './historia-clinica-formulario.html',
})export class HistoriaClinicaFormulario implements OnInit {

  private route = inject(ActivatedRoute);
  private hService = inject(HistoriaClinicaService);
  private dService = inject(DiagnosticoService);
  private router = inject(Router);
  private auth = inject(AuthService);

  private base = this.route.snapshot.data['base'];

  historiaClinicaId = signal<number | undefined>(undefined);
  private idPacienteActual = signal<number | undefined>(undefined);
  diagnosticosExistentes = signal<Diagnostico[]>([]);

  historiaClinicaModel = signal<HistoriaClinicaNueva>({
    fecha: this.fechaDeHoy(),
    observaciones: '',
    evolucion: '',
    id_paciente: 0,
    id_profesional: 0,
    ids_diagnosticos: [],
    diagnosticos: []
  });

  private fechaDeHoy(): string {
    const hoy = new Date();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');

    return `${hoy.getFullYear()}-${mes}-${dia}`;
  }

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

    // La fecha se registra automáticamente al crear la historia clínica.
    // En edición tampoco puede modificarse.
    disabled(campo.fecha, { when: () => true });
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
        { nombre: '', descripcion: '', fechaDiagnostico: this.fechaDeHoy() }
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
            this.diagnosticosExistentes.set(data.diagnosticos ?? []);
            this.idPacienteActual.set(data.id_paciente);
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
    } else {
      /// Alta iniciada desde el detalle de un paciente:
      /// se precargan el paciente y el profesional logueado.
      const paciente = Number(this.route.snapshot.queryParamMap.get('paciente'));
      const profesional = this.auth.getUsuarioId();

      if (Number.isInteger(paciente) && paciente > 0) {
        this.idPacienteActual.set(paciente);
        this.historiaClinicaModel.update(historia => ({
          ...historia,
          id_paciente: paciente
        }));
      }

      if (profesional) {
        this.historiaClinicaModel.update(historia => ({
          ...historia,
          id_profesional: profesional
        }));
      }
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    if (this.historiaClinicaForm().invalid()) {
      this.historiaClinicaForm().markAsTouched();
      return;
    }

    const historiaData = this.historiaClinicaId()
      ? this.historiaClinicaModel()
      : { ...this.historiaClinicaModel(), fecha: this.fechaDeHoy() };

    if (
      historiaData.diagnosticos.some(
        d => !d.nombre.trim() || !d.descripcion.trim()
      )
    ) {
      this.error.set(
        'Complete el nombre y la descripción de todos los diagnósticos.'
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
        next: () => this.guardarDiagnosticosNuevos(historiaData.diagnosticos),
        error: (e) => {
          this.error.set(
            e.error?.message || 'No se pudo actualizar la historia clínica.'
          );
          this.cargando.set(false);
        }
      });

    } else {

      this.hService.guardarHistoriaClinica(historiaData).subscribe({
        next: (creada) => {
          alert('Historia clínica guardada correctamente.');
          this.router.navigate([this.base, 'historiasclinicas', creada.id]);
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

  private guardarDiagnosticosNuevos(
    diagnosticos: DiagnosticoDeHistoriaNueva[]
  ): void {

    if (diagnosticos.length === 0) {
      alert('Historia clínica actualizada correctamente.');
      this.router.navigate([this.base, 'historiasclinicas', this.historiaClinicaId()]);
      return;
    }

    const idHistoriaClinica = this.historiaClinicaId()!;

    forkJoin(
      diagnosticos.map(d => this.dService.guardarDiagnostico({
        nombre: d.nombre.trim(),
        descripcion: d.descripcion.trim(),
        fechaDiagnostico: d.fechaDiagnostico,
        idHistoriaClinica
      }))
    ).subscribe({
      next: () => {
        alert('Historia clínica y diagnósticos guardados correctamente.');
        this.router.navigate([this.base, 'historiasclinicas', this.historiaClinicaId()]);
      },
      error: (e) => {
        this.error.set(
          e.error?.message || 'No se pudieron guardar los diagnósticos.'
        );
        this.cargando.set(false);
      }
    });
  }

  cancelar(): void {
    if (this.historiaClinicaId()) {
      this.router.navigate([this.base, 'historiasclinicas', this.historiaClinicaId()]);
      return;
    }

    if (this.idPacienteActual()) {
      this.router.navigate([this.base, 'pacientes', this.idPacienteActual()]);
      return;
    }

    this.router.navigate([this.base, 'pacientes']);
  }

}


