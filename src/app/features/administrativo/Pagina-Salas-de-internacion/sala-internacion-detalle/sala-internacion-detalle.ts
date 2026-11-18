import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { SalaInternacion } from '../models/sala-internacion';
import { SalaInternacionService } from '../services/sala-internacion-service';

import { Paciente } from '../../Pagina-Paciente/models/paciente';
import { PacienteService } from '../../Pagina-Paciente/services/paciente-service';
import { mensajeDeError } from '../../../../core/utils/mensaje-error';

@Component({
    selector: 'app-sala-internacion-detalle',
    imports: [RouterLink],
    templateUrl: './sala-internacion-detalle.html',
    styleUrl: './sala-internacion-detalle.css'
})
export class SalaInternacionDetalle implements OnInit {

    sala = signal<SalaInternacion | null>(null);
    pacientes = signal<Paciente[]>([]);
    pacienteSeleccionado = signal<number | null>(null);
    egresando = signal<number | null>(null);

    // Pacientes que todavía no están internados en esta sala
    pacientesParaInternar = computed(() => {
        const idsInternados = new Set(
            (this.sala()?.pacientes ?? []).map(paciente => paciente.id)
        );

        return this.pacientes().filter(paciente => !idsInternados.has(paciente.id));
    });

    idSala: number = 0;
    private route= inject(ActivatedRoute);
    
    private base = this.route.snapshot.data['base'];

    constructor(
        private salaService: SalaInternacionService,
        private pacienteService: PacienteService
    ) {}

    ngOnInit(): void {
        this.idSala = Number(this.route.snapshot.paramMap.get('id'));

        this.cargarSala();
        this.cargarPacientes();
    }

    cargarSala(): void {
        this.salaService.getSalaInternacion(this.idSala).subscribe({
            next: (datos) => {
                this.sala.set(this.normalizar(datos));
            },
            error: (error) => {
                console.error('Error al cargar la sala', error);
                alert(mensajeDeError(error, 'No se pudo cargar la sala.'));
            }
        });
    }

    private normalizar(sala: SalaInternacion): SalaInternacion {
        return { ...sala, pacientes: sala.pacientes ?? [] };
    }

    cargarPacientes(): void {
        this.pacienteService.getPacientes().subscribe({
            next: (datos) => {
                this.pacientes.set(datos);
            },
            error: (error) => {
                console.error('Error al cargar los pacientes', error);
            }
        });
    }

    internarPaciente(): void {

        const idPaciente = this.pacienteSeleccionado();

        if (idPaciente === null) {
            alert('Seleccione un paciente.');
            return;
        }

        this.salaService.internarPaciente(this.idSala, idPaciente).subscribe({
            next: (datos) => {
                alert('Paciente internado correctamente.');
                this.pacienteSeleccionado.set(null);
                this.sala.set(this.normalizar(datos));
            },
            error: (error) => {
                console.error('Error al internar el paciente', error);
                alert(mensajeDeError(error, 'No se pudo internar al paciente.'));
            }
        });
    }


    egresarPaciente(paciente: Paciente): void {

        if (!confirm(`¿Dar de alta a ${paciente.nombre} ${paciente.apellido}?`)) {
            return;
        }

        this.egresando.set(paciente.id);

        this.salaService.egresarPaciente(this.idSala, paciente.id).subscribe({
            next: (datos) => {
                this.sala.set(this.normalizar(datos));
                this.egresando.set(null);
            },
            error: (error) => {
                console.error('Error al dar de alta el paciente', error);
                alert(mensajeDeError(error, 'No se pudo dar de alta al paciente.'));
                this.egresando.set(null);
            }
        });
    }


    seleccionarPaciente(event: Event): void {
    const valor = (event.target as HTMLSelectElement).value;

    this.pacienteSeleccionado.set(
        valor === '' ? null : Number(valor)
    );
}


}