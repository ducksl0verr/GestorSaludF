import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Receta } from '../model/receta';
import { RecetaService } from '../services/receta-services';
import { CommonModule } from '@angular/common';

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

  protected base = this.route.snapshot.data['base'];

  recetas = signal<Receta[]>([]);
  cargando = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.listarRecetas();
  }

  listarRecetas(): void {

    this.cargando.set(true);
    this.error.set('');

    this.recetasService.getRecetas().subscribe({
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

  verDetalle(id: number): void {
    this.router.navigate([this.base, 'recetas', id]);
  }

  nuevaReceta(): void {
    this.router.navigate([this.base, 'recetas', 'nuevo']);
  }
}
