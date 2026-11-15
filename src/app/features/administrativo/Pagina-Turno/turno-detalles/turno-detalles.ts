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
  cargando = signal(false);
  error = signal('');

  private route = inject(ActivatedRoute);

  private base = this.route.snapshot.data['base'];
  private esVistaProfesional = this.base === '/profesional';


constructor(
    private turnoService : TurnoService,
    private router : Router
){}

 ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.turnoId.set(id);
    this.cargando.set(true);

    /// En el perfil profesional solo se puede ver un turno propio:
    /// se busca dentro de los turnos que el backend asigna al usuario.
    if (this.esVistaProfesional) {
      this.turnoService.getMisTurnos().subscribe({
        next: (turnos) => {
          const turno = turnos.find((t) => t.id === id);

          if (!turno) {
            this.error.set('No tenés permiso para ver este turno.');
          } else {
            this.turno.set(turno);
          }

          this.cargando.set(false);
        },
        error: (error) => {
          console.error('Error al obtener los turnos del profesional', error);
          this.error.set('No se pudo cargar el turno.');
          this.cargando.set(false);
        }
      });

      return;
    }

    this.turnoService.getTurno(id).subscribe({
      next: (turno) => {
        this.turno.set(turno);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al obtener el turno', error);
        this.error.set('No se pudo cargar el turno.');
        this.cargando.set(false);
      }
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
