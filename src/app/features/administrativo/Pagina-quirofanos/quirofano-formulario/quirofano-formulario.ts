import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { form, FormField, required } from '@angular/forms/signals';

import { QuirofanoService } from '../services/quirofano-service';
import { QuirofanoNuevo } from '../models/quirofano-nuevo';
import { QuirofanoActualizar } from '../models/quirofano-actualizar';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-quirofano-formulario',
    imports: [FormField, RouterLink, FormsModule],
    templateUrl: './quirofano-formulario.html',
    styleUrl: './quirofano-formulario.css'
})
export class QuirofanoFormulario implements OnInit {

    id: number | null = null;

    private route = inject(ActivatedRoute);
    protected base = this.route.snapshot.data['base'];  

    quirofanoModel = signal({
        nombre: '',
        disponible: true
    });

    quirofanoForm = form(this.quirofanoModel, (schema) => {
        required(schema.nombre);
    });

    constructor(
        private router: Router,
        private quirofanoService: QuirofanoService
    ) {}

    ngOnInit(): void {
        const idParametro = this.route.snapshot.params['id'];

        if (idParametro) {
            this.id = Number(idParametro);
            this.cargarQuirofano(this.id);
        }
    }

    cargarQuirofano(id: number): void {
        this.quirofanoService.getQuirofano(id).subscribe({
            next: (datos) => {
                this.quirofanoModel.set({
                    nombre: datos.nombre,
                    disponible: datos.disponible
                });
            },
            error: (error) => {
                console.error('Error al cargar el quirófano', error);
            }
        });
    }

    guardar(): void {

        if (this.id === null) {

            const quirofanoNuevo: QuirofanoNuevo = {
                nombre: this.quirofanoModel().nombre
            };

            this.quirofanoService.guardarQuirofano(quirofanoNuevo).subscribe({
                next: () => {
                    alert('Quirófano registrado correctamente');
                    this.router.navigate([this.base, 'quirofanos']);
                },
                error: (error) => {
                    console.error('Error al registrar el quirófano', error);
                }
            });

        } else {

            const quirofanoActualizar: QuirofanoActualizar = {
                nombre: this.quirofanoModel().nombre,
                disponible: this.quirofanoModel().disponible
            };

            this.quirofanoService.actualizarQuirofano(
                this.id,
                quirofanoActualizar
            ).subscribe({
                next: () => {
                    alert('Quirófano actualizado correctamente');
                    this.router.navigate([this.base, 'quirofanos']);
                },
                error: (error) => {
                    console.error('Error al actualizar el quirófano', error);
                }
            });
        }
    }

    cambiarEstado(event: Event): void {
    const valor = (event.target as HTMLSelectElement).value;

    this.quirofanoModel.update(model => ({
        ...model,
        disponible: valor === 'true'
    }));
}
}