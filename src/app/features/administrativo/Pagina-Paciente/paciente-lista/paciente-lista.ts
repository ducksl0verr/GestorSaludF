import { CommonModule } from '@angular/common';
import { Component, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Paciente } from '../models/paciente';
import { PacienteService } from '../services/paciente-service';
import { Router } from '@angular/router';

@Component({
  imports: [CommonModule, RouterModule],
  selector: 'app-paciente-lista',
  styleUrl: './paciente-lista.css',
  templateUrl: './paciente-lista.html',
})
export class PacienteLista implements OnInit {

pacientes = signal<Paciente[]>([]);

private route = inject(ActivatedRoute);
protected base = this.route.snapshot.data['base'];  

constructor(private servicioPaciente: PacienteService, private router : Router){}

ngOnInit(): void {
  this.cargarPacientes();
}

// Cargar todos los pacientes, (actualiza la lista de los pacientes)
    cargarPacientes(): void {
        this.servicioPaciente.getPacientes().subscribe({
            next: (pacientes) => {
                this.pacientes.set(pacientes);
            },
            error: (error) => {
                console.error('Error al obtener los pacientes', error);
            }
        });
    }

    // Eliminar un paciente
    eliminarPaciente(p: Paciente): void {

        if (!confirm(`¿Eliminar a ${p.nombre} ${p.apellido}?`)) {
            return;
        }

        this.servicioPaciente.borrarPaciente(p.id).subscribe({
            next: () => {
                alert('Paciente eliminado correctamente');
                this.cargarPacientes();
            },
            error: (error) => {
                console.error('No se pudo eliminar el paciente', error);
            }
        });
    }

    // Ir al detalle del paciente
    verDetalle(id: number): void {
        this.router.navigate([this.base, 'pacientes', id]);
    }

    // Ir a editar el paciente
    editarPaciente(id: number): void {
        this.router.navigate([this.base, 'pacientes', 'editar', id]);
    }
}




