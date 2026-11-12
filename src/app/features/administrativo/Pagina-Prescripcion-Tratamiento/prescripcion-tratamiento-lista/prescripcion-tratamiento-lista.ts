
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PacienteService } from '../../Pagina-Paciente/services/paciente-service';
import { Paciente } from '../../Pagina-Paciente/models/paciente';
import { PrescripcionTratamiento } from '../models/prescripcion-tratamiento';

@Component({
  imports: [RouterLink],
  selector: 'app-prescripcion-tratamiento-lista',
  styleUrl: './prescripcion-tratamiento-lista.css',
  templateUrl: './prescripcion-tratamiento-lista.html',
})
export class PrescripcionTratamientoLista implements OnInit {

  private pacienteService = inject(PacienteService);
  private route = inject(ActivatedRoute);
  protected base = this.route.snapshot.data['base'];

  paciente = signal<Paciente | undefined>(undefined);
  prescripciones = signal<PrescripcionTratamiento[]>([]);

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.pacienteService.getPaciente(id).subscribe({
      next: (paciente) => {
        this.paciente.set(paciente);
        this.prescripciones.set(paciente.tratamientos);
      },
      error: (error) => console.error('Error al obtener las prescripciones', error)
    });

  }
}
