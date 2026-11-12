import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { form, FormField, required } from '@angular/forms/signals';

import { ConsultorioService } from '../services/consultorio-service';
import { ConsultorioNuevo } from '../models/consultorio-nuevo';
import { ConsultorioActualizar } from '../models/consultorio-actualizar';

@Component({
    selector: 'app-consultorio-formulario',
    imports: [FormField, RouterLink],
    templateUrl: './consultorio-formulario.html',
    styleUrl: './consultorio-formulario.css'
})
export class ConsultorioFormulario implements OnInit {

    id: number | null = null;

    consultorioModel = signal({
        nombre: ''
    });

    consultorioForm = form(this.consultorioModel, (campo) => {
        required(campo.nombre);
    });

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private consultorioService: ConsultorioService
    ) {}




    ngOnInit(): void {
        const idParametro = this.route.snapshot.paramMap.get('id');

        if (idParametro) {
            this.id = Number(idParametro);
            this.cargarConsultorio(this.id);
        }
    }




    cargarConsultorio(id: number): void {
        this.consultorioService.getConsultorio(id).subscribe({
            next: (datos) => {
                this.consultorioModel.set({
                    nombre: datos.nombre
                });
            },
            error: (error) => {
                console.error('Error al cargar el consultorio', error);
            }
        });
    }


    

    guardar(): void {

        if (this.id === null) {

            const consultorioNuevo: ConsultorioNuevo = {
                nombre: this.consultorioModel().nombre
            };

            this.consultorioService.guardarConsultorio(consultorioNuevo).subscribe({
                next: () => {
                    alert('Consultorio registrado correctamente');
                    this.router.navigate(['/administrativo/consultorios']);
                },
                error: (error) => {
                    console.error('Error al registrar el consultorio', error);
                }
            });

        } else {

            const consultorioActualizar: ConsultorioActualizar = {
                nombre: this.consultorioModel().nombre
            };

            this.consultorioService.actualizarConsultorio(
                this.id,
                consultorioActualizar
            ).subscribe({
                next: () => {
                    alert('Consultorio actualizado correctamente');
                    this.router.navigate(['/administrativo/consultorios']);
                },
                error: (error) => {
                    console.error('Error al actualizar el consultorio', error);
                }
            });
        }
    }
}