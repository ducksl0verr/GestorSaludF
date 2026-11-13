import { Component, inject, OnInit, signal } from '@angular/core';
import { RecetaService } from '../services/receta-services';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Receta } from '../model/receta';

@Component({
  imports: [RouterLink],
  selector: 'app-receta-detalle',
  styleUrl: './receta-detalle.css',
  templateUrl: './receta-detalle.html',
})


export class RecetaDetalle implements OnInit {

  private recetasService = inject(RecetaService);
  private route = inject(ActivatedRoute);

  receta = signal<Receta | null>(null);
  cargando = signal(true);
  error = signal('');

  protected base = this.route.snapshot.data['base'];

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.recetasService.getReceta(id).subscribe({
      next: (data) => {
        this.receta.set(data);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar la receta', error);
        this.error.set('No se pudo cargar la receta.');
        this.cargando.set(false);
      }
    });
  }
}
