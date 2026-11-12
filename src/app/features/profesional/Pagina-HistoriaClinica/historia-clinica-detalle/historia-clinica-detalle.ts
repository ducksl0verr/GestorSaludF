import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HistoriaClinicaService } from '../services/historia-clinica-services';
import { HistoriaClinica } from '../model/historia-clinica';

@Component({
  imports: [RouterLink],
  selector: 'app-historia-clinica-detalle',
  styleUrl: './historia-clinica-detalle.css',
  templateUrl: './historia-clinica-detalle.html',
})
export class HistoriaClinicaDetalle {
  private hService = inject(HistoriaClinicaService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  historiaClinica = signal<HistoriaClinica | null>(null);
  cargando = signal(true);
  error = signal('');

  private base = this.route.snapshot.data['baseHistoriasClinicas'];

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.hService.getHistoriaClinica(id).subscribe({
      next: (h) => {
        this.historiaClinica.set(h);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se encontró la historia clínica.');
        this.cargando.set(false);
      }
    });
  }

  eliminar(h: HistoriaClinica): void {
    if (!confirm('¿Eliminar esta historia clínica?')) return;

    this.hService.borrar(h.id).subscribe({
      next: () => this.router.navigate([this.base]),
      error: () => this.error.set('No se pudo eliminar la historia clínica.')
    });
  }




}
