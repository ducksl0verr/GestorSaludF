import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { Paciente } from '../models/paciente';
import { PacienteService } from '../services/paciente-service';

@Component({
  imports: [RouterLink],
  selector: 'app-paciente-detalle',
  styleUrl: './paciente-detalle.css',
  templateUrl: './paciente-detalle.html',
})
export class PacienteDetalle implements OnInit {

paciente = signal<Paciente | undefined>(undefined);

constructor(private pacienteService: PacienteService, private route: ActivatedRoute, private router: Router) {}

ngOnInit(): void {
  const id = Number(this.route.snapshot.paramMap.get('id'));
  this.pacienteService.getPaciente(id).subscribe({
    next: (paciente) => this.paciente.set(paciente),
    error: (error) => console.error('Error al obtener el paciente', error)
  });
}


eliminar(p: Paciente): void {
    if (!confirm(`¿Eliminar a ${p.nombre} ${p.apellido}?`)) return;

    this.pacienteService.borrarPaciente(p.id).subscribe({
      next: () => this.router.navigate(['/administrativo', 'pacientes']),
      error: () => console.error('No se pudo eliminar el paciente.'),
    });
  }


}
