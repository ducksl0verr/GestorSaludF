import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TurnoService } from '../services/turno-service';
import { Turno } from '../models/turno';
import { CommonModule } from '@angular/common';

@Component({
  imports: [RouterLink, CommonModule],
  selector: 'app-turno-detalles',
  styleUrl: './turno-detalles.css',
  templateUrl: './turno-detalles.html',
})
export class TurnoDetalles implements OnInit {

  turnoId = signal<number | undefined>(undefined);
  turno = signal<Turno | undefined>(undefined);

  private route = inject(ActivatedRoute);

  private base = this.route.snapshot.data['base'];


constructor(private turnoService : TurnoService, private router : Router){}

 ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.turnoId.set(id);

    this.turnoService.getTurno(id).subscribe({
      next: (turno) => {
        this.turno.set(turno);
        console.log('Turno obtenido:', turno);
      },
      error: (error) => console.error('Error al obtener el turno', error)
    });
  }


eliminar(t: Turno): void {
    if (!confirm(`¿Eliminar el turno ${t.id}?`)) return;

    this.turnoService.eliminarTurno(t.id).subscribe({
        next: () => this.router.navigate([this.base, 'turnos']),
        error: () => console.error('No se pudo eliminar el turno.')
    });
}



}