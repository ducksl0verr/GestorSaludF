import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { SalaInternacion } from '../models/sala-internacion';
import { SalaInternacionService } from '../services/sala-internacion-service';

import { Paciente } from '../../Pagina-Paciente/models/paciente';
import { PacienteService } from '../../Pagina-Paciente/services/paciente-service';

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
                this.sala.set(datos);
            },
            error: (error) => {
                console.error('Error al cargar la sala', error);
            }
        });
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
            next: () => {
                alert('Paciente internado correctamente.');
                this.pacienteSeleccionado.set(null);
                this.cargarSala();
            },
            error: (error) => {
                console.error('Error al internar el paciente', error);
                alert(error.error?.message || 'No se pudo internar al paciente.');
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