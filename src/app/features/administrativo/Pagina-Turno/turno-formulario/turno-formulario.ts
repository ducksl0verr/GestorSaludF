import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { form, FormField, required } from '@angular/forms/signals';
import { TurnoService } from '../services/turno-service';
import { TurnoNuevo } from '../models/turno-nuevo';
import { TurnoActualizar } from '../models/turno-actualizar';
import { EstadoTurno } from '../models/estado-turno';

import { PacienteService } from '../../Pagina-Paciente/services/paciente-service';
import { Paciente } from '../../Pagina-Paciente/models/paciente';

import { TratamientoService } from '../../../public/Pagina-Tratamientos/Service/tratamiento-service';
import { Tratamiento } from '../../../public/Pagina-Tratamientos/Model/Tratamiento';

import { ConsultorioService } from '../../Pagina-consultorios/services/consultorio-service';
import { Consultorio } from '../../Pagina-consultorios/models/consultorio';

import { UsuarioService } from '../../../admin/Pagina-Usuarios/service/usuario-service';
import { Profesional } from '../../../admin/Pagina-Usuarios/models/Profesional';

@Component({
    imports: [FormField, RouterLink],
    selector: 'app-turno-formulario',
    styleUrl: './turno-formulario.css',
    templateUrl: './turno-formulario.html',
})
export class TurnoFormulario implements OnInit {

    turnoId = signal<number | undefined>(undefined);

    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private turnoService = inject(TurnoService);
    private pacienteService = inject(PacienteService);
    private tratamientoService = inject(TratamientoService);
    private consultorioService = inject(ConsultorioService);
    private usuarioService = inject(UsuarioService);

    protected base = this.route.snapshot.data['base'];

    estadosTurno: EstadoTurno[] = [
        'PENDIENTE',
        'CONFIRMADO',
        'CANCELADO',
        'FINALIZADO'
    ];

    pacientes = signal<Paciente[]>([]);
    tratamientos = signal<Tratamiento[]>([]);
    consultorios = signal<Consultorio[]>([]);
    profesionales = signal<Profesional[]>([]);

    turnoModel = signal({
        fechaHora: '',
        id_paciente: '0',
        id_tratamiento: '0',
        id_consultorio: '0',
        id_profesional: '0',
        estadoTurno: 'PENDIENTE' as EstadoTurno
    });

    turnoForm = form(this.turnoModel, (campo) => {
        required(campo.fechaHora);
        required(campo.id_paciente);
        required(campo.id_tratamiento);
        required(campo.id_consultorio);
        required(campo.id_profesional);
        required(campo.estadoTurno);
    });

    ngOnInit(): void {
        const id = this.route.snapshot.params['id'];

        if (id) {
            this.turnoId.set(Number(id));

            this.turnoService.getTurno(Number(id)).subscribe({
                next: (turno) => {
                    this.turnoModel.set({
                        fechaHora: turno.fechaHora.slice(0, 16), ///formato: 2026-11-15T10:30
                        id_paciente: turno.id_paciente.toString(),
                        id_tratamiento: turno.id_tratamiento.toString(),
                        id_consultorio: turno.id_consultorio.toString(),
                        id_profesional: turno.id_profesional.toString(),
                        estadoTurno: turno.estadoTurno
                    });
                },
                error: (error) => console.error('Error al obtener el turno', error)
            });

        } else {
            this.cargarPacientes();
            this.cargarTratamientos();
            this.cargarConsultorios();
            this.cargarProfesionales();
        }
    }

    private cargarPacientes(): void {
        this.pacienteService.getPacientes().subscribe({
            next: (pacientes) => this.pacientes.set(pacientes),
            error: (error) => console.error('Error al obtener los pacientes', error)
        });
    }

    private cargarTratamientos(): void {
        this.tratamientoService.getTratamientos().subscribe({
            next: (tratamientos) => this.tratamientos.set(tratamientos),
            error: (error) => console.error('Error al obtener los tratamientos', error)
        });
    }

    private cargarConsultorios(): void {
        this.consultorioService.getConsultorios().subscribe({
            next: (consultorios) => this.consultorios.set(consultorios),
            error: (error) => console.error('Error al obtener los consultorios', error)
        });
    }

    private cargarProfesionales(): void {
        this.usuarioService.getProfesionales().subscribe({
            next: (profesionales) => this.profesionales.set(profesionales),
            error: (error) => console.error('Error al obtener los profesionales', error)
        });
    }

    guardarTurno(): void {

        if (this.turnoForm().invalid()) {
            this.turnoForm().markAsTouched();
            return;
        }

        const datos = this.turnoModel();

        const idPaciente = Number(datos.id_paciente);
        const idTratamiento = Number(datos.id_tratamiento);
        const idConsultorio = Number(datos.id_consultorio);
        const idProfesional = Number(datos.id_profesional);

        if (this.turnoId()) {

            const turnoActualizar: TurnoActualizar = {
                fechaHora: datos.fechaHora,
                estadoTurno: datos.estadoTurno
            };

            this.turnoService.actualizarTurno(this.turnoId()!, turnoActualizar).subscribe({
                next: () => this.router.navigate([this.base, 'turnos']),
                error: (error) => console.error('Error al actualizar el turno', error)
            });

        } else {

            if (idPaciente < 1 || idTratamiento < 1 || idConsultorio < 1 || idProfesional < 1) {
                alert('Debe seleccionar el paciente, el tratamiento, la sala y el profesional.');
                return;
            }

            const turnoNuevo: TurnoNuevo = {
                fechaHora: datos.fechaHora,
                id_paciente: idPaciente,
                id_tratamiento: idTratamiento,
                id_consultorio: idConsultorio,
                id_profesional: idProfesional
            };

            this.turnoService.registrarTurno(turnoNuevo).subscribe({
                next: () => this.router.navigate([this.base, 'turnos']),
                error: (error) => console.error('Error al registrar el turno', error)
            });
        }
    }
}
