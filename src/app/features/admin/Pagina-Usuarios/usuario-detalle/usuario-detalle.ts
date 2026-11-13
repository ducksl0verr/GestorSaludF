import { afterNextRender, Component, computed, inject, signal } from '@angular/core';
import { UsuarioService } from '../service/usuario-service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Usuario } from '../models/Usuario';
import { esProfesional } from '../models/Profesional';

@Component({
  imports: [RouterLink],
  selector: 'app-usuario-detalle',
  styleUrl: './usuario-detalle.css',
  templateUrl: './usuario-detalle.html',
})
export class UsuarioDetalle {
  private servicio = inject(UsuarioService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  usuario = signal<Usuario | null>(null);
  cargando = signal(true);
  error = signal('');

  // se expone para usarlo en el template
  esProfesional = esProfesional;

  listaUrl = computed(() => {
    const u = this.usuario();
    return ['/admin', u && esProfesional(u) ? 'profesionales' : 'usuarios'];
  });

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.servicio.obtener(id).subscribe({
      next: (u) => {
        this.usuario.set(u);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se encontró el usuario.');
        this.cargando.set(false);
      },
    });
  }

  eliminar(u: Usuario): void {
    if (!confirm(`¿Eliminar a ${u.nombre} ${u.apellido}?`)) return;

    this.servicio.borrar(u.id).subscribe({
      next: () => this.router.navigate(['/admin', esProfesional(u) ? 'profesionales' : 'usuarios']),
      error: () => this.error.set('No se pudo eliminar el usuario.'),
    });
  }

}
