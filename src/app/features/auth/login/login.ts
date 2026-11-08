import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth-service';
import { AuthPedido } from '../../../core/models/AuthPedido';
import { CommonModule } from '@angular/common';
import { form, FormField, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  imports: [FormField, CommonModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private auth= inject(AuthService);
  private router = inject(Router);

  inicioModel = signal<AuthPedido>(
    { username: '',
      password:''
    });

  inicioForm = form(this.inicioModel, (campo)=>{
    required(campo.username, { message: 'Ingresá tu usuario.'});
    required(campo.password, { message: 'Ingresá tu contraseña.'});
  });

  cargando= signal(false);
  error=signal('');

  iniciarSesion(event: Event){

    event.preventDefault();

    if(this.inicioForm().invalid()){
      this.inicioForm().markAsTouched();
      return;
    }

    this.cargando.set(true);
    this.error.set('');

    this.auth.iniciarSesion(this.inicioModel()).subscribe({
      next: () => {
        console.log('Login exitoso');
        this.router.navigateByUrl(this.auth.rutaInicio()) //nos debe llevar al layour especifico según el usuario ingresado
      },
      error: (e: HttpErrorResponse) => {
        console.log('Error al iniciar sesión ', e);
        this.cargando.set(false);
        this.error.set(this.mensajeDeError(e));
      }
    });
  }

  private mensajeDeError(e: HttpErrorResponse){
    if(e.status === 0) return 'No se pudo conectar con el servidor.';
    if(e.status===401 || e.status === 403) return 'Usuario o contraseña invalidos.';
    return 'Ocurrió un error inesperado. Intente de nuevo.';
  }
}
