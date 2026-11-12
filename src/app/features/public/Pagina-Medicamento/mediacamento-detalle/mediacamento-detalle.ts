import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MedicamentoService } from '../Service/medicamento-service';
import { Medicamento } from '../Model/Medicamento';

@Component({
  imports: [RouterLink],
  selector: 'app-mediacamento-detalle',
  styleUrl: './mediacamento-detalle.css',
  templateUrl: './mediacamento-detalle.html',
})
export class MediacamentoDetalle {
  private mService = inject(MedicamentoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  med = signal<Medicamento | null> (null);
  cargando = signal(true);
  error = signal('');

  private base = this.route.snapshot.data['base'];

  constructor(){
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.mService.getMedicamento(id).subscribe({
      next: (u) => {
          this.med.set(u);
          this.cargando.set(false);
        },
        error: () => {
          this.error.set('No se encontró la medicación.');
          this.cargando.set(false);
        },
    });
  }

  eliminar(m : Medicamento): void {
        if (!confirm(`¿Eliminar a ${m.nombre}?`)) return;
    
        this.mService.borrarMedicamento(m.id).subscribe({
          next: () => this.router.navigate([this.base, 'medicamentos']),
          error: () => this.error.set('No se pudo eliminar la medicación.'),
        });
      }
}
