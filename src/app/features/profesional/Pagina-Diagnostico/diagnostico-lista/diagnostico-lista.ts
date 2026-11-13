import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Diagnostico } from '../model/diagnostico';
import { DiagnosticoService } from '../services/diagnostico-services';

@Component({
  imports: [CommonModule, RouterModule],
  selector: 'app-diagnostico-lista',
  styleUrl: './diagnostico-lista.css',
  templateUrl: './diagnostico-lista.html',
})
export class DiagnosticoLista implements OnInit {

  diagnosticos = signal<Diagnostico[]>([]);
  cargando = signal(false);
  error = signal('');

  private route = inject(ActivatedRoute);
  protected base = this.route.snapshot.data['base'];

  constructor(
    private dService: DiagnosticoService
  ) {}

  ngOnInit() {
    this.cargarDiagnosticos();
  }

  cargarDiagnosticos() {

    this.cargando.set(true);
    this.error.set('');

    this.dService.getDiagnosticos().subscribe({
      next: (data) => {
        this.diagnosticos.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los diagnósticos.');
        this.cargando.set(false);
      }
    });
  }

  borrarDiagnostico(id: number) {
    if (!confirm('¿Eliminar este diagnóstico?')) return;

    this.dService.borrar(id).subscribe({
      next: () => this.cargarDiagnosticos(),
      error: () => this.error.set('No se pudo eliminar el diagnóstico.')
    });
  }

}
