import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
  private router = inject(Router);
  protected base = this.route.snapshot.data['base'];

  /// Cuando se llega desde el detalle de un paciente
  /// (/profesional/historiasclinicas?paciente=7) se muestran solo sus historias.
  protected pacienteFiltro = signal<number | null>(null);

  protected historiasFiltradas = computed(() => {
    const pacienteId = this.pacienteFiltro();
    const historias = this.historiasClinicas();

    return pacienteId === null
      ? historias
      : historias.filter((h) => h.id_paciente === pacienteId);
  });

  constructor(
    private hService: HistoriaClinicaService
  ) {
    this.route.queryParamMap
      .pipe(takeUntilDestroyed())
      .subscribe(params => {
        this.pacienteFiltro.set(this.parsePaciente(params.get('paciente')));
      });
  }

  ngOnInit() {
    this.cargarHistoriasClinicas();
  }

  private parsePaciente(raw: string | null): number | null {
    if (!raw) return null;

    const id = Number(raw);

    return Number.isInteger(id) && id > 0 ? id : null;
  }

  verTodas(): void {
    this.router.navigate([this.base, 'historiasclinicas']);
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
