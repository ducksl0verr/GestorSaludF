import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Diagnostico } from '../model/diagnostico';
import { Router, RouterLink } from '@angular/router';
import { DiagnosticoService } from '../services/diagnostico-services';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-diagnostico-lista',
  styleUrl: './diagnostico-lista.css',
  templateUrl: './diagnostico-lista.html',
})
export class DiagnosticoLista {

  diagnosticos = signal<Diagnostico[]>([]);
  private router = inject(Router);

  get rutaDiagnosticos(): string {
    return this.router.url.startsWith('/admin/')
      ? '/admin/diagnosticos'
      : '/administrativo/diagnosticos';
  }

  constructor(
    private dService: DiagnosticoService
  ) {}

  ngOnInit() {
    this.cargarDiagnosticos();
  }

  cargarDiagnosticos() {
    this.dService.getDiagnosticos().subscribe(data => {
      console.log(data);
      this.diagnosticos.set(data);
    });
  }

  borrarDiagnostico(id: number) {
    if (!confirm('¿Eliminar este diagnóstico?')) return;

    this.dService.borrar(id).subscribe(() => {
      this.cargarDiagnosticos();
    });
  }

}


