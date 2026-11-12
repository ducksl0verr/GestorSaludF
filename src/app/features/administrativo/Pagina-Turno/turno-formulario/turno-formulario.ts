import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { form, FormField, min, required } from '@angular/forms/signals';
import { TurnoService } from '../services/turno-service';
import { TurnoNuevo } from '../models/turno-nuevo';
import { TurnoActualizar } from '../models/turno-actualizar';
import { EstadoTurno } from '../models/estado-turno';
@Component({
    imports: [FormField, RouterLink],
    selector: 'app-turno-formulario',
    styleUrl: './turno-formulario.css',
    templateUrl: './turno-formulario.html',
})
export class TurnoFormulario implements OnInit {

    turnoId = signal<number | undefined>(undefined);
    
    private route = inject(ActivatedRoute);
    protected base = this.route.snapshot.data['base'];

    estadosTurno: EstadoTurno[] = [
        'PENDIENTE',
        'CONFIRMADO',
        'CANCELADO',
        'FINALIZADO'
    ];

    turnoModel = signal({
        fechaHora: '',
        id_paciente: 0,
        id_tratamiento: 0,
        id_consultorio: 0,
        id_profesional: 0,
        estadoTurno: 'PENDIENTE' as EstadoTurno
    });

    turnoForm = form(this.turnoModel, (campo) => {
        required(campo.fechaHora);
        required(campo.id_paciente);
        min(campo.id_paciente, 1);
        required(campo.id_tratamiento);
        min(campo.id_tratamiento, 1);
        required(campo.id_consultorio);
        min(campo.id_consultorio, 1);
        required(campo.id_profesional);
        min(campo.id_profesional, 1);
        required(campo.estadoTurno);

    });

    constructor(
        private turnoService: TurnoService,
        private router: Router
    ) {}

    ngOnInit(): void {
        const id = this.route.snapshot.params['id'];

        if (id) {
            this.turnoId.set(Number(id));

            this.turnoService.getTurno(Number(id)).subscribe({
                next: (turno) => {
                    this.turnoModel.set({
                        fechaHora: turno.fechaHora.slice(0, 16), ///formato: 2026-11-15T10:30
                        id_paciente: turno.id_paciente,
                        id_tratamiento: turno.id_tratamiento,
                        id_consultorio: turno.id_consultorio,
                        id_profesional: turno.id_profesional,
                        estadoTurno: turno.estadoTurno
                    });
                },
                error: (error) => console.error('Error al obtener el turno', error)
            });
        }
    }

    guardarTurno(): void {

        if (this.turnoForm().invalid()) {
            this.turnoForm().markAsTouched();
            return;
        }

        const datos = this.turnoModel();

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

            const turnoNuevo: TurnoNuevo = {
                fechaHora: datos.fechaHora,
                id_paciente: datos.id_paciente,
                id_tratamiento: datos.id_tratamiento,
                id_consultorio: datos.id_consultorio,
                id_profesional: datos.id_profesional
            };

            this.turnoService.registrarTurno(turnoNuevo).subscribe({
                next: () => this.router.navigate([this.base, 'turnos']),
                error: (error) => console.error('Error al registrar el turno', error)
            });
        }
    }
}