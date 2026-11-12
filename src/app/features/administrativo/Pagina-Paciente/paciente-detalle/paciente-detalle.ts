import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { Paciente } from '../models/paciente';
import { PacienteService } from '../services/paciente-service';
import { Obra_Social } from '../../../public/Pagina-ObraSocial/Model/Obra_Social';
import { ObraSocialService } from '../../../public/Pagina-ObraSocial/Service/obra-social-service';

@Component({
  imports: [RouterLink],
  selector: 'app-paciente-detalle',
  styleUrl: './paciente-detalle.css',
  templateUrl: './paciente-detalle.html',
})
export class PacienteDetalle implements OnInit {

    paciente = signal<Paciente | undefined>(undefined);
    obraSocial = signal<Obra_Social | undefined>(undefined);
    private route = inject(ActivatedRoute);
    protected base = this.route.snapshot.data['base'];  

constructor(private pacienteService: PacienteService, private router: Router,private obraSocialService: ObraSocialService,) {}

ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.pacienteService.getPaciente(id).subscribe({
        next: (paciente) => {
            this.paciente.set(paciente);

            this.obraSocialService.getObraSocial(paciente.id_obraSocial).subscribe({
                next: (obraSocial) => {
                    this.obraSocial.set(obraSocial);
                },
                error: (error) => console.error('Error al obtener la obra social', error)
            });
        },
        error: (error) => console.error('Error al obtener el paciente', error)
    });
}


eliminar(p: Paciente): void {
    if (!confirm(`¿Eliminar a ${p.nombre} ${p.apellido}?`)) return;

    this.pacienteService.borrarPaciente(p.id).subscribe({
      next: () => this.router.navigate([this.base, 'pacientes']),
      error: () => console.error('No se pudo eliminar el paciente.'),
    });
  }


}
