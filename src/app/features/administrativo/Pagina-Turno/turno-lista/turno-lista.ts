import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth-service';
import { EstadoTurno } from '../models/estado-turno';
import { Turno } from '../models/turno';
import { TurnoService } from '../services/turno-service';


@Component({
  imports: [CommonModule, RouterModule],
  selector: 'app-turno-lista',
  styleUrl: './turno-lista.css',
  templateUrl: './turno-lista.html',
})
export class TurnoLista implements OnInit {

  turnos = signal<Turno[]>([]);
  cargando = signal(false);
  error = signal('');
  mensajeAccion = signal('');

  fechaDesde = signal('');
  fechaHasta = signal('');

  rangoInvalido = computed(
    () => !!this.fechaDesde() && !!this.fechaHasta() && this.fechaDesde() > this.fechaHasta()
  );

  turnosFiltrados = computed(() => {
    const desde = this.fechaDesde();
    const hasta = this.fechaHasta();

    if (!desde && !hasta) {
      return this.turnos();
    }

    return this.turnos().filter(turno => {
      const dia = (turno.fechaHora ?? '').slice(0, 10);

      if (!dia) return false;
      if (desde && dia < desde) return false;
      if (hasta && dia > hasta) return false;

      return true;
    });
  });

  private route = inject(ActivatedRoute);
  protected base = this.route.snapshot.data['base'];
  protected esVistaProfesional = this.base === '/profesional';


  constructor(
    private router : Router,
    private turnoService : TurnoService,
    private auth : AuthService
  ){}

  get matriculaProfesional(): string | null {
    return this.auth.getMatricula();
  }

  ngOnInit(): void {
    this.cargarTurnos();
  }

  limpiarFiltros(): void {
    this.fechaDesde.set('');
    this.fechaHasta.set('');
  }

  cargarTurnos(): void {
    this.cargando.set(true);
    this.error.set('');

    /// En el perfil profesional el backend devuelve solo los turnos
    /// del profesional autenticado (GET /api/turnos/mis-turnos).
    const pedido = this.esVistaProfesional
      ? this.turnoService.getMisTurnos()
      : this.turnoService.getTurnos();

    pedido.subscribe({
      next: (turnos) => {
        this.turnos.set(turnos);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al obtener los turnos', error);
        this.error.set(
          this.esVistaProfesional
            ? 'No se pudieron cargar tus turnos asignados.'
            : 'No se pudieron cargar los turnos.'
        );
        this.cargando.set(false);
      }
    });
  }

  editarTurno(id: number): void {
    this.router.navigate([this.base, 'turnos', 'editar', id]);
  }

  eliminarTurno(turno: Turno): void {
    if (!confirm(`¿Eliminar el turno N° ${turno.id}?`)) return;

    this.mensajeAccion.set('');
    this.turnoService.eliminarTurno(turno.id).subscribe({
      next: () => {
        this.mensajeAccion.set('El turno se eliminó correctamente.');
        this.cargarTurnos();
      },
      error: (error) => {
        console.error('Error al eliminar el turno', error);
        this.mensajeAccion.set(this.mensajeError(error, 'No se pudo eliminar el turno.'));
      }
    });
  }

  cambiarEstado(turno: Turno, estado: EstadoTurno): void {
    if (estado !== 'CANCELADO' && estado !== 'FINALIZADO') return;
    if (turno.estadoTurno === estado) return;

    this.mensajeAccion.set('');
    this.turnoService.cambiarEstadoTurno(turno.id, estado).subscribe({
      next: () => {
        this.mensajeAccion.set(`El turno se marcó como ${estado}.`);
        this.cargarTurnos();
      },
      error: (error) => {
        console.error('Error al cambiar el estado del turno', error);
        this.mensajeAccion.set(this.mensajeError(error, 'No se pudo cambiar el estado del turno.'));
      }
    });
  }

  private mensajeError(error: any, porDefecto: string): string {
    return error?.error?.mensaje || porDefecto;
  }

}
