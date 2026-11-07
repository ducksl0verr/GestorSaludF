import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth-service';
import { AuthPedido } from '../../../core/models/AuthPedido';

@Component({
  imports: [FormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private auth= inject(AuthService);

  username=signal('');
  password=signal('');

  cargando= signal(false);
  error=signal('');

  iniciarSesion(){

    const credenciales: AuthPedido = {
      username: 'usuario',
      password: '12345'
    }

    this.auth.login(credenciales).subscribe({
      next: (respuesta) => {
        console.log('Login exitoso', respuesta);

        localStorage.setItem('accessToken', respuesta.accessToken);
        localStorage.setItem('refreshToken', respuesta.refreshToken);
      },
      error: (error) => {
        console.log('Error al iniciar sesión ', error);
      }
    });
  }
}
