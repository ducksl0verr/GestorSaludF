import { Component, inject, signal } from '@angular/core';
import {
  form,
  FormField,
  maxLength,
  minLength,
  required,
  validate,
} from '@angular/forms/signals';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';

@Component({
  imports: [RouterLink, FormField, CommonModule],
  selector: 'app-restablecer-contrasena',
  styleUrl: './restablecer-contrasena.css',
  templateUrl: './restablecer-contrasena.html',
})
export class RestablecerContrasena {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  private token = this.route.snapshot.queryParamMap.get('token');
  protected tokenFaltante = !this.token;

  modelo = signal({ nuevaContrasena: '', confirmar: '' });

  formulario = form(this.modelo, (campo) => {
    required(campo.nuevaContrasena, { message: 'La contraseña es obligatoria.' });
    minLength(campo.nuevaContrasena, 8, { message: 'Debe tener al menos 8 caracteres.' });
    maxLength(campo.nuevaContrasena, 64, { message: 'No puede superar los 64 caracteres.' });

    required(campo.confirmar, { message: 'Confirmá la contraseña.' });
    validate(campo.confirmar, ({ value, valueOf }) =>
      value() !== valueOf(campo.nuevaContrasena)
        ? { kind: 'noCoincide', message: 'Las contraseñas no coinciden.' }
        : null
    );
  });

  cargando = signal(false);
  error = signal('');
  exito = signal(false);

  onSubmit(event: Event) {
    event.preventDefault();

    if (!this.token || this.formulario().invalid()) {
      this.formulario().markAsTouched();
      return;
    }

    this.cargando.set(true);
    this.error.set('');

    this.authService.restablecerContrasena(this.token, this.modelo().nuevaContrasena).subscribe({
      next: () => {
        this.cargando.set(false);
        this.exito.set(true);
      },
      error: (e: HttpErrorResponse) => {
        this.cargando.set(false);
        this.error.set(this.mensajeDeError(e));
      },
    });
  }

  private mensajeDeError(e: HttpErrorResponse): string {
    if (e.status === 0) {
      return 'No se pudo conectar con el servidor.';
    }

    const cuerpo = e.error;

    if (typeof cuerpo === 'string' && cuerpo.trim()) {
      return cuerpo;
    }

    if (cuerpo && typeof cuerpo === 'object') {
      if (typeof cuerpo.mensaje === 'string') {
        return cuerpo.mensaje;
      }
      if (typeof cuerpo.message === 'string') {
        return cuerpo.message;
      }
      const primero = Object.values(cuerpo).find((valor) => typeof valor === 'string');
      if (typeof primero === 'string') {
        return primero;
      }
    }

    return 'El enlace no es válido o ya venció.';
  }
}
