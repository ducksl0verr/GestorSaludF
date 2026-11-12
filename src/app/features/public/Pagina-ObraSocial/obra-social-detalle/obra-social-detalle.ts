import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ObraSocialService } from '../Service/obra-social-service';
import { Obra_Social } from '../Model/Obra_Social';

@Component({
  imports: [RouterLink],
  selector: 'app-obra-social-detalle',
  styleUrl: './obra-social-detalle.css',
  templateUrl: './obra-social-detalle.html',
})
export class ObraSocialDetalle {
  
  private oService = inject(ObraSocialService);
  private route = inject(ActivatedRoute);
  private router= inject(Router);

  obra = signal<Obra_Social | null>(null);
  cargando = signal(true);
  error = signal('');

  private base = this.route.snapshot.data['base'];

  constructor() {
      const id = Number(this.route.snapshot.paramMap.get('id'));
  
      this.oService.getObraSocial(id).subscribe({
        next: (u) => {
          this.obra.set(u);
          this.cargando.set(false);
        },
        error: () => {
          this.error.set('No se encontró a la obra social.');
          this.cargando.set(false);
        },
      });
    }
  
    eliminar(o: Obra_Social): void {
      if (!confirm(`¿Eliminar a ${o.nombre}?`)) return;
  
      this.oService.borrarObraSocial(o.id).subscribe({
        next: () => this.router.navigate([this.base, 'obrasSociales']),
        error: () => this.error.set('No se pudo eliminar a la obra social.'),
      });
    }

}
