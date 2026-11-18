import { Component, inject, OnInit, signal } from '@angular/core';
import { RecetaService } from '../services/receta-services';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Receta } from '../model/receta';
import { PacienteService } from '../../../administrativo/Pagina-Paciente/services/paciente-service';
import { UsuarioService } from '../../../admin/Pagina-Usuarios/service/usuario-service';

@Component({
  imports: [RouterLink],
  selector: 'app-receta-detalle',
  styleUrl: './receta-detalle.css',
  templateUrl: './receta-detalle.html',
})


export class RecetaDetalle implements OnInit {

  private recetasService = inject(RecetaService);
  private pacienteService = inject(PacienteService);
  private usuarioService = inject(UsuarioService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  receta = signal<Receta | null>(null);
  cargando = signal(true);
  error = signal('');
  pacienteNombre = signal('');
  profesionalNombre = signal('');

  protected base = this.route.snapshot.data['base'];

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.recetasService.getReceta(id).subscribe({
      next: (data) => {
        this.receta.set(data);
        this.cargarNombres(data);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar la receta', error);
        this.error.set('No se pudo cargar la receta.');
        this.cargando.set(false);
      }
    });
  }

  private cargarNombres(r: Receta): void {
    const pacienteCompleto =
      `${r.nombre_paciente ?? ''} ${r.apellido_paciente ?? ''}`.trim();

    if (pacienteCompleto) {
      this.pacienteNombre.set(pacienteCompleto);
    } else {
      this.pacienteService.getPaciente(r.id_paciente).subscribe({
        next: (p) => this.pacienteNombre.set(`${p.nombre} ${p.apellido}`.trim()),
        error: () => this.pacienteNombre.set(`Paciente #${r.id_paciente}`)
      });
    }

    const profesionalCompleto =
      `${r.nombre_profesional ?? ''} ${r.apellido_profesional ?? ''}`.trim();

    if (profesionalCompleto) {
      this.profesionalNombre.set(profesionalCompleto);
    } else {
      this.usuarioService.getUsuario(r.id_profesional).subscribe({
        next: (u) => this.profesionalNombre.set(`${u.nombre} ${u.apellido}`.trim()),
        error: () => this.profesionalNombre.set(`Profesional #${r.id_profesional}`)
      });
    }
  }

  // Se quita de la vista, pero no se envía ninguna petición DELETE al backend.
  eliminarReceta(): void {
    const receta = this.receta();

    if (!receta || !confirm('¿Quitar esta receta de la lista? No se eliminará de la base de datos.')) return;

    this.recetasService.ocultarReceta(receta.id);
    this.router.navigate([this.base, 'recetas'], {
      queryParams: { paciente: receta.id_paciente }
    });
  }
}
