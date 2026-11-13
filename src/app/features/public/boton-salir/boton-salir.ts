import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth-service';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-boton-salir',
  styleUrl: './boton-salir.css',
  template: '<button type="button" (click)="salir()">Cerrar sesión</button>',
})
export class BotonSalir {
  private auth = inject(AuthService);
  private router = inject(Router);

  salir(){
    this.auth.cerrarSesion();
    this.router.navigateByUrl('/login');
  }
}
