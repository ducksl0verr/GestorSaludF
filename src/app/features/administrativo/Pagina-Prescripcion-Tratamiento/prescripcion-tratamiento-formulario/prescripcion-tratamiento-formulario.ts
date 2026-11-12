import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { form, FormField, required } from '@angular/forms/signals';

import { PacienteService } from '../../Pagina-Paciente/services/paciente-service';
import { Paciente } from '../../Pagina-Paciente/models/paciente';

import { TratamientoService } from '../../../public/Pagina-Tratamientos/Service/tratamiento-service';

import { Tratamiento } from '../../../public/Pagina-Tratamientos/Model/Tratamiento';

import { UsuarioService } from '../../../admin/Pagina-Usuarios/service/usuario-service';
import { Profesional } from '../../../admin/Pagina-Usuarios/models/Profesional';

import { PrescripcionTratamientoService } from '../services/prescripcion-tratamiento-service';
import { PrescripcionTratamientoNueva } from '../models/prescripcion-tratamiento-nueva';

@Component({
    imports: [FormField, RouterLink],
    selector: 'app-prescripcion-tratamiento-formulario',
    styleUrl: './prescripcion-tratamiento-formulario.css',
    templateUrl: './prescripcion-tratamiento-formulario.html',
})
export class PrescripcionTratamientoFormulario implements OnInit {

    private pacienteService = inject(PacienteService);
    private tratamientoService = inject(TratamientoService);
    private usuarioService = inject(UsuarioService);
    private prescripcionService = inject(PrescripcionTratamientoService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    protected base = this.route.snapshot.data['base'];

    paciente = signal<Paciente | undefined>(undefined);
    tratamientos = signal<Tratamiento[]>([]);
    profesionales = signal<Profesional[]>([]);

    idPaciente: number = 0;

    // Datos del formulario
    prescripcionModel = signal({
    id_tratamiento: '0',
    id_profesional: '0',
    fecha_inicio: '',
    fecha_final: ''
});

    prescripcionForm = form(this.prescripcionModel, (campo) => {
        required(campo.id_tratamiento);
        required(campo.id_profesional);
        required(campo.fecha_inicio);
    });

    ngOnInit(): void {

        this.idPaciente = Number(this.route.snapshot.paramMap.get('id'));

        this.pacienteService.getPaciente(this.idPaciente).subscribe({
            next: (paciente) => this.paciente.set(paciente),
            error: (error) => console.error('Error al obtener el paciente', error)
        });

        this.tratamientoService.getTratamientos().subscribe({
            next: (tratamientos) => this.tratamientos.set(tratamientos),
            error: (error) => console.error('Error al obtener los tratamientos', error)
        });

        this.usuarioService.getProfesionales().subscribe({
            next: (profesionales) => this.profesionales.set(profesionales),
            error: (error) => console.error('Error al obtener los profesionales', error)
        });
    }

    guardarPrescripcion(): void {

        if (this.prescripcionForm().invalid()) {
            return;
        }

        const datos = this.prescripcionModel();

        const prescripcion: PrescripcionTratamientoNueva = {
            id_paciente: this.idPaciente,
            id_tratamiento: Number(datos.id_tratamiento),
            id_profesional: Number(datos.id_profesional),
            fecha_inicio: datos.fecha_inicio,
            fecha_final: datos.fecha_final || null
        };

        this.prescripcionService.registrarPrescripcionTratamiento(prescripcion).subscribe({
            next: () => {
                alert('Prescripción registrada correctamente.');
                this.router.navigate([this.base, 'prescripciones', this.idPaciente]);
            },
            error: (error) => {
                console.error('Error al registrar la prescripción', error);
                alert('No se pudo registrar la prescripción.');
            }
        });
    }
}