import { Component, inject, Inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';

@Component({
  imports: [RouterLink, RouterOutlet],
  selector: 'app-admin-layout',
  styleUrl: './admin-layout.css',
  templateUrl: './admin-layout.html',
})
export class AdminLayout {
  private authS= inject(AuthService);
  private router = inject(Router);


  salir(){
    this.authS.cerrarSesion();
    this.router.navigateByUrl('/login');
  }

}
