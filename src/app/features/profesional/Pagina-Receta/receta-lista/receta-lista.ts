import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Receta } from '../model/receta';
import { RecetaService } from '../services/receta-services';
import { CommonModule, NumberSymbol } from '@angular/common';
import { AuthService } from '../../../../core/services/auth-service';
import { PacienteService } from '../../../administrativo/Pagina-Paciente/services/paciente-service';

@Component({
  imports: [RouterModule, CommonModule],
  selector: 'app-receta-lista',
  styleUrl: './receta-lista.css',
  templateUrl: './receta-lista.html',
})
export class RecetaLista implements OnInit {

  private recetasService = inject(RecetaService);
  private pacienteService = inject(PacienteService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);

  protected base = this.route.snapshot.data['base'];

  recetas = signal<Receta[]>([]);
  cargando = signal(false);
  error = signal('');
  pacienteId = signal<number | null>(null);
  pacienteNombre = signal('');
  puedeCrear = this.auth.tienePermiso('CREAR_RECETA');

  ngOnInit(): void {
    const paciente = Number(this.route.snapshot.queryParamMap.get('paciente'));

    if (Number.isInteger(paciente) && paciente > 0) {
      this.pacienteId.set(paciente);
      this.cargarNombrePaciente(paciente);
    }

    this.listarRecetas();
  }

  private cargarNombrePaciente(id: number): void {
    this.pacienteService.getPaciente(id).subscribe({
      next: (paciente) => {
        this.pacienteNombre.set(`${paciente.nombre} ${paciente.apellido}`.trim());
      },
      error: () => this.pacienteNombre.set(`Paciente #${id}`)
    });
  }

  listarRecetas(): void {

    this.cargando.set(true);
    this.error.set('');

    const paciente = this.pacienteId();
    const peticion = paciente
      ? this.recetasService.getRecetasPorPaciente(paciente)
      : this.recetasService.getRecetas();

    peticion.subscribe({
      next: (data) => {
        this.recetas.set(data);
        this.cargando.set(false);
      },

      error: (err) => {
        console.error('Error al cargar recetas', err);
        this.error.set('No se pudieron cargar las recetas.');
        this.cargando.set(false);
      }
    });
  }

  verPaciente(): void{
    const paciente = this.pacienteId();

    if (paciente) {
      this.router.navigate([this.base, 'pacientes', paciente]);
    }
  }

  verDetalle(id: number): void {
    const paciente = this.pacienteId();

    this.router.navigate(
      [this.base, 'recetas', id],
      paciente ? { queryParams: { paciente } } : {}
    );
  }

  // Eliminación visual: solo se quita de la vista, sin llamar al backend.
  eliminarReceta(receta: Receta): void {
    if (!confirm('¿Quitar esta receta de la lista? No se eliminará de la base de datos.')) return;

    this.recetasService.ocultarReceta(receta.id);
    this.recetas.update(lista => lista.filter(r => r.id !== receta.id));
  }

  nombrePaciente(receta: Receta): string {
    return `${receta.nombre_paciente ?? ''} ${receta.apellido_paciente ?? ''}`.trim()
      || this.pacienteNombre()
      || 'Paciente';
  }

  nombreProfesional(receta: Receta): string {
    return `${receta.nombre_profesional ?? ''} ${receta.apellido_profesional ?? ''}`.trim()
      || 'Profesional';
  }

  nuevaReceta(): void {
    const paciente = this.pacienteId();

    this.router.navigate(
      [this.base, 'recetas', 'nuevo'],
      paciente ? { queryParams: { paciente } } : {}
    );
  }
}
