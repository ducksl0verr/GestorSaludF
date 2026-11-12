import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DiagnosticoService } from '../services/diagnostico-services';
import { Router } from 'express';
import { DiagnosticoNuevo } from '../model/diagnostico';
import { form, FormField, maxLength, minLength, required } from '@angular/forms/signals';
import { CommonModule } from '@angular/common';

@Component({
  imports: [FormField,CommonModule,RouterModule],
  selector: 'app-diagnostico-formulario',
  styleUrl: './diagnostico-formulario.css',
  templateUrl: './diagnostico-formulario.html',
})

export class DiagnosticoFormulario implements OnInit {

  private route = inject(ActivatedRoute);
  private dService = inject(DiagnosticoService);
  private router = inject(Router);

  private base = this.route.snapshot.data['baseDiagnosticos'];

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

  });

  cargando = signal(false);
  error = signal('');

  ngOnInit(): void {}

  onSubmit(event: Event): void {

    event.preventDefault();

    if (this.diagnosticoForm().invalid()) {
      this.diagnosticoForm().markAsTouched();
      return;
    }

    const diagnosticoData = this.diagnosticoModel();

    this.cargando.set(true);
    this.error.set('');

    this.dService.guardarDiagnostico(diagnosticoData).subscribe({

      next: () => {
        alert('Diagnóstico guardado correctamente.');
        this.router.navigate([this.base]);
      },

      error: (e) => {
        this.error.set(
          e.error?.message || 'No se pudo guardar el diagnóstico.'
        );
        this.cargando.set(false);
      }

    });

  }

}