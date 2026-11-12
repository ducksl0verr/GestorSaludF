import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { email, form, FormField, required } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  imports: [RouterLink, FormField, CommonModule],
  selector: 'app-olvide-contrasena',
  styleUrl: './olvide-contrasena.css',
  templateUrl: './olvide-contrasena.html',
})
export class OlvideContrasena {
  private authService = inject(AuthService);   // el nombre real de tu servicio

  modelo = signal({ email: '' });

  formulario = form(this.modelo, (campo) => {
    required(campo.email, { message: 'El email es obligatorio.' });
    email(campo.email, { message: 'Ingresá un email válido.' });
  });

  cargando = signal(false);
  enviado = signal(false);
  error = signal('');

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.formulario().invalid()) {
      this.formulario().markAsTouched();
      return;
    }

    this.cargando.set(true);
    this.error.set('');

    this.authService.solicitarRecuperacion(this.modelo().email).subscribe({
      next: () => {
        this.cargando.set(false);
        this.enviado.set(true);
      },
      error: () => {
        this.cargando.set(false);
        this.error.set('No se pudo procesar la solicitud. Intentá de nuevo.');
      },
    });
  }
}