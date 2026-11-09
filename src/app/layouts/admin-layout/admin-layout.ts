import { Component, inject, Inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import { BotonSalir } from '../../features/public/boton-salir/boton-salir';

@Component({
  imports: [RouterLink, RouterOutlet, BotonSalir],
  selector: 'app-admin-layout',
  styleUrl: './admin-layout.css',
  templateUrl: './admin-layout.html',
})
export class AdminLayout {
  private authS= inject(AuthService);
  private router = inject(Router);

}
