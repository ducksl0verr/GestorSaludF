import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { form, FormField, required, min } from '@angular/forms/signals';

import { SalaInternacionService } from '../services/sala-internacion-service';
import { SalaInternacionNueva } from '../models/sala-internacion-nueva';
import { SalaInternacionActualizar } from '../models/sala-internacion-actualizar';

@Component({
    selector: 'app-sala-internacion-formulario',
    imports: [FormField, RouterLink],
    templateUrl: './sala-internacion-formulario.html',
    styleUrl: './sala-internacion-formulario.css'
})
export class SalaInternacionFormulario implements OnInit {

    id: number | null = null;

    
    private route= inject(ActivatedRoute);
    
    private base = this.route.snapshot.data['base'];

    salaModel = signal({
        capacidad_maxima: 1
    });

    salaForm = form(this.salaModel, (campo) => {
        required(campo.capacidad_maxima);
        min(campo.capacidad_maxima, 1);
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
              this.salaModel.set({
                    capacidad_maxima: datos.capacidad_maxima
          });
        },
            error: (error) => {
                console.error('Error al cargar la sala', error);
            }
  });
    }

    guardar(): void {

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
                }
            });
        }
    }
}