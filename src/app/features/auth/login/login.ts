import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  imports: [FormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private auth= inject(AuthService);

  email = signal('');
  password = signal('');
  mensaje=signal('');
  cargando= signal(false);

  iniciarSesion(){
    this.mensaje.set('');
    this.cargando.set(true);

    this.auth.login(this.email(), this.password())
    .subscribe({
      next: (respuesta)=>{
        localStorage.setItem('token', respuesta.token);
        this.mensaje.set('Login exitoso. El token se ha recibido.');
        this.cargando.set(false);
      },
      error:(error)=>{
        this.mensaje.set(
        error.status === 401
        ? 'Email o contraseña incorrectos.'
        : 'Error al conectar con el servidor.'
      );
      this.cargando.set(false);
      }
    });
  }
}
