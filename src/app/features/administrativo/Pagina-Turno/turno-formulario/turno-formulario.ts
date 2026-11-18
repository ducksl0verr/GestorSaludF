import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { form, FormField, required } from '@angular/forms/signals';
import { TurnoService } from '../services/turno-service';
import { TurnoNuevo } from '../models/turno-nuevo';
import { TurnoActualizar } from '../models/turno-actualizar';
import { EstadoTurno } from '../models/estado-turno';
import { Turno } from '../models/turno';

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
    protected esVistaProfesional = this.base === '/profesional';

    error = signal('');
    conflicto = signal('');
    verificando = signal(false);

    private verificacionActual = 0;

    estadosTurno: EstadoTurno[] = [
        'PENDIENTE',
        'CONFIRMADO',
        'CANCELADO',
        'FINALIZADO'
    ];

    /// Horarios disponibles: de 08:00 a 20:00, cada media hora.
    horasDisponibles: string[] = (() => {
        const horas: string[] = [];
        for (let minutos = 8 * 60; minutos <= 20 * 60; minutos += 30) {
            const hora = String(Math.floor(minutos / 60)).padStart(2, '0');
            const minuto = String(minutos % 60).padStart(2, '0');
            horas.push(`${hora}:${minuto}`);
        }
        return horas;
    })();

    private readonly hoy = new Date();
    readonly fechaMinima = this.formatearFecha(this.hoy);
    readonly fechaMaxima = this.formatearFecha(
        new Date(this.hoy.getFullYear(), this.hoy.getMonth() + 2, this.hoy.getDate())
    );

    pacientes = signal<Paciente[]>([]);
    tratamientos = signal<Tratamiento[]>([]);
    consultorios = signal<Consultorio[]>([]);
    profesionales = signal<Profesional[]>([]);

    turnoModel = signal({
        fecha: '',
        hora: '',
        id_paciente: '0',
        id_tratamiento: '0',
        id_consultorio: '0',
        id_profesional: '0',
        estadoTurno: 'PENDIENTE' as EstadoTurno
    });

    turnoForm = form(this.turnoModel, (campo) => {
        required(campo.fecha, {message: "La fecha es obligatoria."});
        required(campo.hora, {message: "La hora es obligatoria."});
        required(campo.id_paciente, {message: "El paciente es obligatorio."});
        required(campo.id_consultorio, {message: "El consultorio es obligatorio."});
        required(campo.id_profesional, {message: "El profesional es obligatorio."});
        required(campo.estadoTurno, {message: "El estado del turno es obligatorio."});
    });

    constructor() {
        /// Cada vez que cambian fecha, horario, profesional o sala se consulta
        /// la disponibilidad al backend, igual que al registrar el turno.
        effect(() => {
            const datos = this.turnoModel();
            const idExcluido = this.turnoId();

            if (this.esVistaProfesional
                || !datos.fecha
                || !datos.hora
                || Number(datos.id_profesional) < 1
                || Number(datos.id_consultorio) < 1) {
                this.verificacionActual++;
                this.conflicto.set('');
                this.verificando.set(false);
                return;
            }

            const fechaHora = `${datos.fecha}T${datos.hora}:00`;
            const numero = ++this.verificacionActual;

            this.verificando.set(true);
            this.turnoService.verificarDisponibilidad(
                fechaHora,
                Number(datos.id_profesional),
                Number(datos.id_consultorio),
                idExcluido
            ).subscribe({
                next: (respuesta) => {
                    if (numero !== this.verificacionActual) return;
                    this.conflicto.set(respuesta.disponible ? '' : respuesta.mensaje);
                    this.verificando.set(false);
                },
                error: () => {
                    if (numero !== this.verificacionActual) return;
                    this.conflicto.set('');
                    this.verificando.set(false);
                }
            });
        });
    }

    ngOnInit(): void {
        /// El panel profesional no puede crear ni editar turnos: solo cambiar el estado
        /// desde el listado (CANCELADO / FINALIZADO).
        if (this.esVistaProfesional) {
            this.error.set('Desde el panel profesional no se pueden crear ni editar turnos. Solo podés cambiar el estado a CANCELADO o FINALIZADO desde el listado.');
            return;
        }

        const id = this.route.snapshot.params['id'];

        if (id) {
            this.turnoId.set(Number(id));

            this.turnoService.getTurno(Number(id)).subscribe({
                next: (turno) => this.cargarModeloDesdeTurno(turno),
                error: (error) => {
                    console.error('Error al obtener el turno', error);
                    this.error.set(this.mensajeError(error, 'No se pudo cargar el turno.'));
                }
            });

        } else {
            this.cargarPacientes();
            this.cargarTratamientos();
            this.cargarConsultorios();
            this.cargarProfesionales();
        }
    }

    private formatearFecha(fecha: Date): string {
        const anio = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const dia = String(fecha.getDate()).padStart(2, '0');
        return `${anio}-${mes}-${dia}`;
    }

    private cargarModeloDesdeTurno(turno: Turno): void {
        const fechaHora = turno.fechaHora ?? '';

        this.turnoModel.set({
            fecha: fechaHora.slice(0, 10),
            hora: fechaHora.slice(11, 16),
            id_paciente: '0',
            id_tratamiento: '0',
            id_consultorio: '0',
            id_profesional: '0',
            estadoTurno: turno.estadoTurno
        });
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
        this.error.set('');

        if (this.turnoForm().invalid()) {
            this.turnoForm().markAsTouched();
            this.error.set('Completá todos los campos obligatorios.');
            return;
        }

        if (this.verificando()) {
            this.error.set('Esperá a que se verifique la disponibilidad.');
            return;
        }

        if (this.conflicto()) {
            this.error.set(this.conflicto());
            return;
        }

        const datos = this.turnoModel();

        if (datos.fecha < this.fechaMinima || datos.fecha > this.fechaMaxima) {
            this.error.set('La fecha debe estar entre hoy y los próximos 2 meses.');
            return;
        }

        const fechaHora = `${datos.fecha}T${datos.hora}`;

        if (this.turnoId()) {
            const turnoActualizar: TurnoActualizar = {
                fechaHora,
                estadoTurno: datos.estadoTurno
            };

            this.turnoService.actualizarTurno(this.turnoId()!, turnoActualizar).subscribe({
                next: () => this.router.navigate([this.base, 'turnos']),
                error: (error) => {
                    console.error('Error al actualizar el turno', error);
                    this.error.set(this.mensajeError(error, 'No se pudo actualizar el turno.'));
                }
            });

        } else {
            const idPaciente = Number(datos.id_paciente);
            const idTratamiento = Number(datos.id_tratamiento);
            const idConsultorio = Number(datos.id_consultorio);
            const idProfesional = Number(datos.id_profesional);

            if (idPaciente < 1 || idConsultorio < 1 || idProfesional < 1) {
                this.error.set('Debe seleccionar el paciente, la sala y el profesional.');
                return;
            }

            const turnoNuevo: TurnoNuevo = {
                fechaHora,
                id_paciente: idPaciente,
                id_tratamiento: idTratamiento > 0 ? idTratamiento : null,
                id_consultorio: idConsultorio,
                id_profesional: idProfesional
            };

            this.turnoService.registrarTurno(turnoNuevo).subscribe({
                next: () => this.router.navigate([this.base, 'turnos']),
                error: (error) => {
                    console.error('Error al registrar el turno', error);
                    this.error.set(this.mensajeError(error, 'No se pudo registrar el turno.'));
                }
            });
        }
    }

    private mensajeError(error: any, porDefecto: string): string {
        return error?.error?.mensaje || porDefecto;
    }
}
