import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Usuario } from '../models/Usuario';
import { UsuarioService } from '../service/usuario-service';
import { esProfesional } from '../models/Profesional';
import { AuthService } from '../../../../core/services/auth-service';
import { Roles } from '../../../auth/enums/Roles';

@Component({
  imports: [RouterLink],
  selector: 'app-perfil',
  styleUrl: './perfil.css',
  templateUrl: './perfil.html',
})
export class Perfil {
  private servicio = inject(UsuarioService);
  private auth = inject(AuthService);

  usuario = signal<Usuario | null>(null);
  cargando = signal(true);
  error = signal('');

  esProfesional = esProfesional;

  inicioUrl = this.auth.rutaInicio();

  constructor() {
    const id = this.auth.getUsuarioId();
    const rol = this.auth.getRol();

    if (id == null) {
      this.error.set('No se pudo identificar al usuario autenticado.');
      this.cargando.set(false);
      return;
    }

    // Los profesionales tienen permiso VER_PROFESIONAL (no VER_USUARIO),
    // por eso se consulta su endpoint específico para ver su propio perfil.
    const peticion = rol === Roles.ROLE_PROFESIONAL
      ? this.servicio.getProfesional(id)
      : this.servicio.getUsuario(id);

    peticion.subscribe({
      next: (u) => {
        this.usuario.set(u);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el perfil.');
        this.cargando.set(false);
      },
    });
  }
}
