import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DiagnosticoService } from '../services/diagnostico-services';
import { DiagnosticoNuevo } from '../model/diagnostico';
import { form, FormField, maxLength, min, minLength, required, disabled } from '@angular/forms/signals';
import { CommonModule } from '@angular/common';

@Component({
  imports: [FormField, CommonModule, RouterModule],
  selector: 'app-diagnostico-formulario',
  styleUrl: './diagnostico-formulario.css',
  templateUrl: './diagnostico-formulario.html',
})

export class DiagnosticoFormulario implements OnInit {

  diagnosticoId = signal<number | undefined>(undefined);
  volverAHistoria?: number;

  private route = inject(ActivatedRoute);
  private dService = inject(DiagnosticoService);
  private router = inject(Router);

  private base = this.route.snapshot.data['base'];

  diagnosticoModel = signal<DiagnosticoNuevo>({
    nombre: '',
    descripcion: '',
    fechaDiagnostico: this.fechaDeHoy(),
    idHistoriaClinica: this.historiaDesdeQuery()
  });

  private historiaDesdeQuery(): number {
    const historia = Number(this.route.snapshot.queryParamMap.get('historia'));

    return Number.isInteger(historia) && historia > 0 ? historia : 0;
  }

  private fechaDeHoy(): string {
    const hoy = new Date();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');

    return `${hoy.getFullYear()}-${mes}-${dia}`;
  }

  diagnosticoForm = form(this.diagnosticoModel, (campo) => {

    required(campo.nombre, {
      message: 'El nombre del diagnóstico es obligatorio.'
    });

    minLength(campo.nombre, 3, {
      message: 'El nombre debe tener al menos 3 caracteres.'
    });

    maxLength(campo.nombre, 100, {
      message: 'El nombre no puede superar los 100 caracteres.'
    });

    required(campo.descripcion, {
      message: 'La descripción es obligatoria.'
    });

    minLength(campo.descripcion, 3, {
      message: 'La descripción debe tener al menos 3 caracteres.'
    });

    maxLength(campo.descripcion, 500, {
      message: 'La descripción no puede superar los 500 caracteres.'
    });

    // La fecha se registra automáticamente con el día de creación.
    min(campo.idHistoriaClinica, 1, {
      message: 'Debe indicar una historia clínica válida.'
    });

    // Al editar un diagnóstico no se puede cambiar la historia clínica asociada.
    disabled(campo.idHistoriaClinica, { when: () => !!this.diagnosticoId() });

  });

  cargando = signal(false);
  error = signal('');

  ngOnInit(): void {

    const historia = this.historiaDesdeQuery();

    if (historia > 0) {
      this.volverAHistoria = historia;
    }

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    this.diagnosticoId.set(Number(id));

    this.dService.getDiagnostico(this.diagnosticoId()!).subscribe({
      next: (d) => {
        this.diagnosticoModel.set({
          nombre: d.nombre,
          descripcion: d.descripcion,
          fechaDiagnostico: d.fechaDiagnostico,
          idHistoriaClinica: d.idHistoriaClinica
        });
      },
      error: () => {
        this.error.set('No se pudo cargar el diagnóstico.');
      }
    });
  }

  onSubmit(event: Event): void {

    event.preventDefault();

    if (this.diagnosticoForm().invalid()) {
      this.diagnosticoForm().markAsTouched();
      return;
    }

    const diagnosticoData = this.diagnosticoModel();

    this.cargando.set(true);
    this.error.set('');

    const peticion = this.diagnosticoId()
      ? this.dService.actualizarDiagnostico(this.diagnosticoId()!, diagnosticoData)
      : this.dService.guardarDiagnostico(diagnosticoData);

    peticion.subscribe({

      next: () => {
        alert(this.diagnosticoId()
          ? 'Diagnóstico actualizado correctamente.'
          : 'Diagnóstico guardado correctamente.');
        this.volver();
      },

      error: (e) => {
        this.error.set(
          e.error?.message || 'No se pudo guardar el diagnóstico.'
        );
        this.cargando.set(false);
      }

    });

  }

  cancelar(): void {
    this.volver();
  }

  private volver(): void {
    if (this.volverAHistoria) {
      this.router.navigate([this.base, 'historiasclinicas', this.volverAHistoria]);
      return;
    }

    this.router.navigate([this.base, 'diagnosticos']);
  }

}
