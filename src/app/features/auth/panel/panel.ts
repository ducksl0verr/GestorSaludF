import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { RespuestaRegistro } from '../../../core/models/RespuestaRegistro';
import { RepsuestaProtegida } from '../models/RespuestaProtegida';

@Component({
  imports: [],
  selector: 'app-panel',
  styleUrl: './panel.css',
  templateUrl: './panel.html',
})
export class Panel {
  private http = inject(HttpClient);
  private router = inject(Router);

  respuesta= signal<RepsuestaProtegida | null>(null);
  error=signal('');

  comprobarAcceso(){
    this.error.set('');
    this.respuesta.set(null);

    this.http.get<RepsuestaProtegida>('')
    .subscribe({
      next:(datos)=> this.respuesta.set(datos),
      error: (e)=>{
        `Error HTTP ${e.status}: ${
        e.status === 401 || e.status === 403
      ? 'Acceso rechazado. Revise su autenticación.'
    : 'No se pudo conectar con el servidor.'
  }`
      }
    });
  }

  cerrarSesion(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
