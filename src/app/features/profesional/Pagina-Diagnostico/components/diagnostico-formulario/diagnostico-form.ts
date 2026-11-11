import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { form, FormField, maxLength, minLength, required } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Diagnostico } from '../../model/diagnostico';
import { DiagnosticoService } from '../../services/diagnostico';


@Component({
  imports: [FormField, CommonModule, RouterModule],
  selector: 'app-diagnostico-form',
  styleUrl: './diagnostico-form.css',
  templateUrl: './diagnostico-form.html',
})


export class DiagnosticoForm implements OnInit {

    id: string | null = null;

    diagnosticoModel = signal<Omit<Diagnostico, 'id'>>({
        nombre: '',
        descripcion: '',
        fechaDiagnostico: ''
    });

    diagnosticoForm = form(this.diagnosticoModel, (campo) => {

        required(campo.nombre, {
            message: 'El nombre es obligatorio.'
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

        minLength(campo.descripcion, 5, {
            message: 'La descripción debe tener al menos 5 caracteres.'
        });

        maxLength(campo.descripcion, 200, {
            message: 'La descripción no puede superar los 200 caracteres.'
        });

        required(campo.fechaDiagnostico, {
            message: 'La fecha del diagnóstico es obligatoria.'
        });

    });

    constructor(
        private diagnosticoService: DiagnosticoService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {

        this.id = this.route.snapshot.paramMap.get('id');

        if (this.id) {

            this.diagnosticoService.getDiagnostico(this.id).subscribe({

                next: (data) => {

                    this.diagnosticoModel.set({
                        nombre: data.nombre,
                        descripcion: data.descripcion,
                        fechaDiagnostico: data.fechaDiagnostico
                    });

                },

                error: () => {
                    alert('No se pudo cargar el diagnóstico.');
                }

            });

        }

    }

    onSubmit(event: Event): void {

        event.preventDefault();

        this.diagnosticoForm().markAsTouched();

        if (this.diagnosticoForm().invalid()) {

            const errores = this.diagnosticoForm()
                .errorSummary()
                .map(error => error.message)
                .filter(Boolean);

            alert('Corregí los siguientes errores:\n\n' + errores.join('\n'));

            return;
        }

        const diagnosticoData = this.diagnosticoModel();

        // MODIFICAR DIAGNOSTICO
        if (this.id) {

            const id = this.id;

            const diagnostico: Diagnostico = {
                id: id,
                ...diagnosticoData
            };

            this.diagnosticoService.putDiagnostico(diagnostico).subscribe({

                next: () => {

                    alert('Diagnóstico actualizado correctamente.');

                    this.router.navigate(['/admin/diagnosticos', id]);

                },

                error: () => {

                    alert('Error al actualizar el diagnóstico.');

                }

            });

        } else {

            // REGISTRAR DIAGNOSTICO
            this.diagnosticoService.postDiagnostico(diagnosticoData).subscribe({

                next: (nuevo) => {

                    alert('Diagnóstico registrado correctamente.');

                    this.router.navigate(['/admin/diagnosticos', nuevo.id]);

                },

                error: () => {

                    alert('Error al registrar el diagnóstico.');

                }

            });

        }

    }

    cancelar(): void {

        this.router.navigate(['/admin/diagnosticos']);

    }

}






