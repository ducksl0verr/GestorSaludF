import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DiagnosticoService } from '../services/diagnostico-services';
import { Diagnostico } from '../model/diagnostico';

@Component({
  imports: [RouterLink],
  selector: 'app-diagnostico-detalle',
  styleUrl: './diagnostico-detalle.css',
  templateUrl: './diagnostico-detalle.html',
})

export class DiagnosticoDetalle {

  private dService = inject(DiagnosticoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  diagnostico = signal<Diagnostico | null>(null);
  cargando = signal(true);
  error = signal('');

  protected base = this.route.snapshot.data['base'];

  constructor() {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.dService.getDiagnostico(id).subscribe({
      next: (d) => {
        this.diagnostico.set(d);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se encontró el diagnóstico.');
        this.cargando.set(false);
      }
    });

  }

  eliminar(d: Diagnostico): void {

    if (!confirm(`¿Eliminar el diagnóstico ${d.nombre}?`)) return;

    this.dService.borrar(d.id).subscribe({
      next: () => this.router.navigate([this.base, 'diagnosticos']),
      error: () => this.error.set('No se pudo eliminar el diagnóstico.')
    });

  }

}
