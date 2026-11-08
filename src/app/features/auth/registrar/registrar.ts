import { Component, signal } from '@angular/core';
import { Roles } from '../../public/enums/Roles';
import { CommonModule } from '@angular/common';
import { email, form, FormField, maxLength, minLength, required } from '@angular/forms/signals';
import { AuthService } from '../../../core/services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { CuentaNueva, CuentaNuevaPedido } from '../../../core/models/CuentaNueva';

@Component({
  imports: [CommonModule, FormField, RouterLink],
  selector: 'app-registrar',
  styleUrl: './registrar.css',
  templateUrl: './registrar.html',
})
export class Registrar {

  readonly roles = Object.values(Roles);

  usuarioModel = signal<CuentaNueva>({
    nombre: '',
    apellido: '',
    matricula:'',
    dni: '',
    username: '',
    contacto: {
      email: '',
      telefono: ''
    },
    password: '',
    role: Roles.ROLE_PROFESIONAL
  });

  usuarioForm= form(this.usuarioModel, (campo)=>{
    required(campo.nombre, { message: 'El nombre es obligatorio.'});
    minLength(campo.nombre, 3, { message: 'El nombre debe tener al menos 3 caracteres.'});

    required(campo.apellido, { message: 'El apellido es obligatorio.'});
    minLength(campo.apellido, 3, { message: 'El apellido debe tener al menos 3 caracteres.'});

    required(campo.dni, { message: 'El DNI es obligatorio.'});
    minLength(campo.dni, 7, { message: 'El DNI debe tener 7 u 8 dígitos.'});
    maxLength(campo.dni, 8, { message: 'El DNI debe tener 7 u 8 dígitos.'});

    required(campo.username, { message: 'El nombre de usuario es obligatorio.'});
    minLength(campo.username, 3, { message: 'El nombre de usuario debe tener al menos 3 caracteres.'});

    // Validaciones del objeto contacto
    required(campo.contacto.email, { message: 'El email es obligatorio.'});
    email(campo.contacto.email, { message: 'Ingrese un email válido.'});

    required(campo.contacto.telefono, { message: 'El teléfono es obligatorio.'});
    minLength(campo.contacto.telefono, 8, { message: 'Mínimo 8 caracteres.'});
    maxLength(campo.contacto.telefono, 15, { message: 'Máximo 15 caracteres'});
    //Cierre

    required(campo.password, { message: 'La contraseña es obligatoria.'});
    minLength(campo.password, 8, { message: 'La constraseña debe tener al menos 8 caracteres'});

    required(campo.role);
  });

  cargando = signal(false);
  error = signal('');

  constructor(
    private authS: AuthService,
    private router: Router
  ){}

  onSubmit(event: Event): void {
    
    event.preventDefault();

    if(this.usuarioForm().invalid()){
      console.log('Formulario inválido.');
      this.usuarioForm().markAsTouched();
      return;
    }

    this.cargando.set(true);
    this.error.set('');

    const {matricula, ...resto} = this.usuarioModel();

    const cuenta: CuentaNuevaPedido = {
      ...resto,
      matricula: matricula.trim() || null,
    };

    this.authS.registrar(cuenta).subscribe({
      next: (respuesta)=>{
        console.log('Registro exitoso: ', respuesta);
        this.router.navigate(['/login']);
      },
      error: (e)=>{
        this.error.set(
          e.error?.message || 'Error al registrar el usuario'
        );
        this.cargando.set(false);
      }
    });
  }
}
