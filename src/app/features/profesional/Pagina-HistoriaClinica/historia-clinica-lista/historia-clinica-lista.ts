import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { signalGetFn } from '@angular/core/primitives/signals';
import { Router, RouterModule } from '@angular/router';
import { HistoriaClinica } from '../model/historia-clinica';
import { HistoriaClinicaService } from '../services/historia-clinica-services';

@Component({
  imports: [CommonModule,RouterModule],
  selector: 'app-historia-clinica-lista',
  styleUrl: './historia-clinica-lista.css',
  templateUrl: './historia-clinica-lista.html',
})

export class HistoriaClinicaLista {

  historiasClinicas = signal<HistoriaClinica[]>([]);
  private router = inject(Router);

  get rutaHistoriasClinicas(): string {
    return this.router.url.startsWith('/admin/')
      ? '/admin/historias-clinicas'
      : '/administrativo/historias-clinicas';
  }

  constructor(
    private hService: HistoriaClinicaService
  ) {}

  ngOnInit() {
    this.cargarHistoriasClinicas();
  }

  cargarHistoriasClinicas() {
    this.hService.getHistoriasClinicas().subscribe(data => {
      console.log(data);
      this.historiasClinicas.set(data);
    });
  }

  borrarHistoriaClinica(id: number) {
    if (!confirm('¿Eliminar esta historia clínica?')) return;

    this.hService.borrar(id).subscribe(() => {
      this.cargarHistoriasClinicas();
    });
  }

}
