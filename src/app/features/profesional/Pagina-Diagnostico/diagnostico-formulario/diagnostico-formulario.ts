import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DiagnosticoService } from '../services/diagnostico-services';
import { DiagnosticoNuevo } from '../model/diagnostico';
import { form, FormField, maxLength, min, minLength, required } from '@angular/forms/signals';
import { CommonModule } from '@angular/common';

@Component({
  imports: [FormField, CommonModule, RouterModule],
  selector: 'app-diagnostico-formulario',
  styleUrl: './diagnostico-formulario.css',
  templateUrl: './diagnostico-formulario.html',
})

export class DiagnosticoFormulario implements OnInit {

  diagnosticoId?: number;

  private route = inject(ActivatedRoute);
  private dService = inject(DiagnosticoService);
  private router = inject(Router);

  private base = this.route.snapshot.data['base'];

  diagnosticoModel = signal<DiagnosticoNuevo>({
    nombre: '',
    descripcion: '',
    fechaDiagnostico: '',
    idHistoriaClinica: 0
  });

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

    required(campo.fechaDiagnostico, {
      message: 'La fecha del diagnóstico es obligatoria.'
    });

    min(campo.idHistoriaClinica, 1, {
      message: 'Debe indicar una historia clínica válida.'
    });

  });

  cargando = signal(false);
  error = signal('');

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    this.diagnosticoId = Number(id);

    this.dService.getDiagnostico(this.diagnosticoId).subscribe({
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

    const peticion = this.diagnosticoId
      ? this.dService.actualizarDiagnostico(this.diagnosticoId, diagnosticoData)
      : this.dService.guardarDiagnostico(diagnosticoData);

    peticion.subscribe({

      next: () => {
        alert(this.diagnosticoId
          ? 'Diagnóstico actualizado correctamente.'
          : 'Diagnóstico guardado correctamente.');
        this.router.navigate([this.base, 'diagnosticos']);
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
    this.router.navigate([this.base, 'diagnosticos']);
  }

}
