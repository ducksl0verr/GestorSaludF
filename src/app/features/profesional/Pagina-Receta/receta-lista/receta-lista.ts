import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Receta } from '../model/receta';
import { RecetaService } from '../services/receta-services';
import { CommonModule, NumberSymbol } from '@angular/common';
import { AuthService } from '../../../../core/services/auth-service';

@Component({
  imports: [RouterModule, CommonModule],
  selector: 'app-receta-lista',
  styleUrl: './receta-lista.css',
  templateUrl: './receta-lista.html',
})
export class RecetaLista implements OnInit {

  private recetasService = inject(RecetaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);

  protected base = this.route.snapshot.data['base'];

  recetas = signal<Receta[]>([]);
  cargando = signal(false);
  error = signal('');
  pacienteId = signal<number | null>(null);
  puedeCrear = this.auth.tienePermiso('CREAR_RECETA');

  ngOnInit(): void {
    const paciente = Number(this.route.snapshot.queryParamMap.get('paciente'));

    if (Number.isInteger(paciente) && paciente > 0) {
      this.pacienteId.set(paciente);
    }

    this.listarRecetas();
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

  verTodas(): void {
    this.pacienteId.set(null);
    this.router.navigate([this.base, 'recetas']);
    this.listarRecetas();
  }

  verPaciente(): void{
    this.router.navigate([this.base, 'pacientes', this.pacienteId]);
  }

  verDetalle(id: number): void {
    this.router.navigate([this.base, 'recetas', id]);
  }

  nuevaReceta(): void {
    const paciente = this.pacienteId();

    this.router.navigate(
      [this.base, 'recetas', 'nuevo'],
      paciente ? { queryParams: { paciente } } : {}
    );
  }
}
