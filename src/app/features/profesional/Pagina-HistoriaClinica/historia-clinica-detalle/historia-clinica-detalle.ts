import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HistoriaClinicaService } from '../services/historia-clinica-services';
import { HistoriaClinica } from '../model/historia-clinica';
import { PacienteService } from '../../../administrativo/Pagina-Paciente/services/paciente-service';
import { UsuarioService } from '../../../admin/Pagina-Usuarios/service/usuario-service';

@Component({
  imports: [RouterLink],
  selector: 'app-historia-clinica-detalle',
  styleUrl: './historia-clinica-detalle.css',
  templateUrl: './historia-clinica-detalle.html',
})
export class HistoriaClinicaDetalle {
  private hService = inject(HistoriaClinicaService);
  private pacienteService = inject(PacienteService);
  private usuarioService = inject(UsuarioService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  historiaClinica = signal<HistoriaClinica | null>(null);
  cargando = signal(true);
  error = signal('');

  pacienteNombre = signal('');
  profesionalNombre = signal('');

  private base = this.route.snapshot.data['base'];

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.hService.getHistoriaClinica(id).subscribe({
      next: (h) => {
        this.historiaClinica.set(h);
        this.cargando.set(false);
        this.cargarNombres(h);
      },
      error: () => {
        this.error.set('No se encontró la historia clínica.');
        this.cargando.set(false);
      }
    });
  }

  private cargarNombres(h: HistoriaClinica): void {
    const pacienteCompleto =
      `${h.nombre_paciente ?? ''} ${h.apellido_paciente ?? ''}`.trim();

    if (pacienteCompleto) {
      this.pacienteNombre.set(pacienteCompleto);
    } else {
      this.pacienteService.getPaciente(h.id_paciente).subscribe({
        next: (p) => this.pacienteNombre.set(`${p.nombre} ${p.apellido}`.trim()),
        error: () => this.pacienteNombre.set(`Paciente #${h.id_paciente}`)
      });
    }

    const profesionalCompleto =
      `${h.nombre_profesional ?? ''} ${h.apellido_profesional ?? ''}`.trim();

    if (profesionalCompleto) {
      this.profesionalNombre.set(profesionalCompleto);
    } else {
      this.usuarioService.getUsuario(h.id_profesional).subscribe({
        next: (u) => this.profesionalNombre.set(`${u.nombre} ${u.apellido}`.trim()),
        error: () => this.profesionalNombre.set(`Profesional #${h.id_profesional}`)
      });
    }
  }

  eliminar(h: HistoriaClinica): void {
    if (!confirm('¿Eliminar esta historia clínica?')) return;

    this.hService.borrar(h.id).subscribe({
      next: () => this.router.navigate([this.base, 'pacientes', h.id_paciente]),
      error: () => this.error.set('No se pudo eliminar la historia clínica.')
    });
  }




}
