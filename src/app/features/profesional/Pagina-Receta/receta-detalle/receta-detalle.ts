import { Component, inject, OnInit, signal } from '@angular/core';
import { RecetaService } from '../services/receta-services';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  private router = inject(Router);

  receta = signal<Receta | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.recetasService.getReceta(id).subscribe({
      next: (data) => {
        this.receta.set(data);
      },
      error: (error) => {
        console.error('Error al cargar la receta', error);
      }
    });
  }

  volver(): void {
    this.router.navigate(['/recetas']);
  }
}


