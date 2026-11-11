
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { Receta } from '../../model/receta';
import { RecetaService } from '../../services/receta';

@Component({
  selector: 'app-receta-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './recetas-detail.html',
  styleUrl: './recetas-detail.css'
})
export class RecetaDetail implements OnInit {

  receta = signal<Receta | undefined>(undefined);

  constructor(
    private recetaService: RecetaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {

      this.recetaService.getReceta(id).subscribe({

        next: (data) => {
          this.receta.set(data);
        },

        error: () => {
          alert('Error al obtener la receta.');
        }

      });

    }

  }

  eliminarReceta(id: string | undefined): void {

    if (!id) {
      alert('No se encontró el ID de la receta.');
      return;
    }

    if (confirm('¿Desea eliminar esta receta?')) {

      this.recetaService.deleteReceta(id).subscribe({

        next: () => {
          alert('Receta eliminada correctamente.');
          this.router.navigate(['/admin/recetas']);
        },

        error: () => {
          alert('Error al eliminar la receta.');
        }

      });

    }

  }

}
