import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HistoriaClinica } from '../model/historia-clinica';
import { HistoriaClinicaService } from '../services/historia-clinica-services';

@Component({
  imports: [CommonModule, RouterModule],
  selector: 'app-historia-clinica-lista',
  styleUrl: './historia-clinica-lista.css',
  templateUrl: './historia-clinica-lista.html',
})

export class HistoriaClinicaLista implements OnInit {

  historiasClinicas = signal<HistoriaClinica[]>([]);
  cargando = signal(false);
  error = signal('');

  private route = inject(ActivatedRoute);
  protected base = this.route.snapshot.data['base'];

  constructor(
    private hService: HistoriaClinicaService
  ) {}

  ngOnInit() {
    this.cargarHistoriasClinicas();
  }

  cargarHistoriasClinicas() {

    this.cargando.set(true);
    this.error.set('');

    this.hService.getHistoriasClinicas().subscribe({
      next: (data) => {
        this.historiasClinicas.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las historias clínicas.');
        this.cargando.set(false);
      }
    });
  }

  borrarHistoriaClinica(id: number) {
    if (!confirm('¿Eliminar esta historia clínica?')) return;

    this.hService.borrar(id).subscribe({
      next: () => this.cargarHistoriasClinicas(),
      error: () => this.error.set('No se pudo eliminar la historia clínica.')
    });
  }

}
