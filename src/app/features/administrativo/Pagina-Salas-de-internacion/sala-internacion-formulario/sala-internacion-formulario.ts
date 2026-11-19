import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { form, FormField, max, required, min } from '@angular/forms/signals';

import { SalaInternacionService } from '../services/sala-internacion-service';
import { SalaInternacionNueva } from '../models/sala-internacion-nueva';
import { SalaInternacionActualizar } from '../models/sala-internacion-actualizar';
import { mensajeDeError } from '../../../../core/utils/mensaje-error';

@Component({
    selector: 'app-sala-internacion-formulario',
    imports: [FormField, RouterLink],
    templateUrl: './sala-internacion-formulario.html',
    styleUrl: './sala-internacion-formulario.css'
})
export class SalaInternacionFormulario implements OnInit {

    id: number | null = null;

    internados = signal(0);

    private route= inject(ActivatedRoute);
    
    private base = this.route.snapshot.data['base'];

    salaModel = signal({
        capacidad_maxima: 1
    });

    error = signal('');

    salaForm = form(this.salaModel, (campo) => {
        required(campo.capacidad_maxima);
        min(campo.capacidad_maxima, () => Math.max(1, this.internados()));
        max(campo.capacidad_maxima, 20, { message: 'La capacidad no puede superar 20.' });
    });

    constructor(
        private router: Router,
        private salaService: SalaInternacionService) {}

    ngOnInit(): void {
        const idParametro = this.route.snapshot.params['id'];

        if (idParametro) {
            this.id = Number(idParametro);
            this.cargarSala(this.id);
        }
    }

    cargarSala(id: number): void {
        this.salaService.getSalaInternacion(id).subscribe({
          next: (datos) => {
              this.internados.set(datos.pacientes?.length ?? 0);
              this.salaModel.set({
                    capacidad_maxima: datos.capacidad_maxima
          });
        },
            error: (error) => {
                console.error('Error al cargar la sala', error);
                this.error.set(mensajeDeError(error, 'No se pudo cargar la sala.'));
            }
  });
    }

    guardar(): void {

        if (this.salaForm().invalid()) {
            this.salaForm().markAsTouched();
            return;
        }

        this.error.set('');

        if (this.id === null) {

            const salaNueva: SalaInternacionNueva = {
                capacidad_maxima: this.salaModel().capacidad_maxima
            };

            this.salaService.guardarSalaInternacion(salaNueva).subscribe({
                next: () => {
                    alert('Sala de internación registrada correctamente');
                    this.router.navigate([this.base, 'salas-internacion']);
                },
                error: (error) => {
                    console.error('Error al registrar la sala', error);
                    this.error.set(mensajeDeError(error, 'No se pudo registrar la sala.'));
                }
            });

        } else {

            const salaActualizar: SalaInternacionActualizar = {
                capacidad_maxima: this.salaModel().capacidad_maxima
            };

            this.salaService.actualizarSalaInternacion(
                this.id,
                salaActualizar
            ).subscribe({
                next: () => {
                    alert('Sala de internación actualizada correctamente');
                    this.router.navigate([this.base, 'salas-internacion']);
                },
                error: (error) => {
                    console.error('Error al actualizar la sala', error);
                    this.error.set(mensajeDeError(error, 'No se pudo actualizar la sala.'));
                }
            });
        }
    }
}