import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { email, form, FormField, maxLength, minLength, required } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Usuario } from '../models/Usuario';
import { Roles } from '../../../auth/enums/Roles';
import { UsuarioService } from '../service/usuario-service';
import { UsuarioFormModel } from '../models/UsuarioFormModel';
import { esProfesional } from '../models/Profesional';
import { Observable } from 'rxjs';
import { CuentaNuevaPedido } from '../../../../core/models/CuentaNueva';

@Component({
  imports: [CommonModule, RouterModule, FormField],
  selector: 'app-usuario-formulario',
  styleUrl: './usuario-formulario.css',
  templateUrl: './usuario-formulario.html',
})
export class UsuarioFormulario {

  readonly Roles = Roles;
  readonly roles = Object.values(Roles);

  
  private uService= inject(UsuarioService);
  private router= inject(Router);
  private route = inject(ActivatedRoute);

  private id = this.route.snapshot.paramMap.get('id');
  esEdicion = this.id !==null;

  model = signal<UsuarioFormModel>({
    nombre: '',
    apellido: '',
    dni: '',
    matricula: '',
    contacto: {
      email: '',
      telefono: '',
    },
    username: '',
    password: '',
    role: Roles.ROLE_PROFESIONAL
  });

  usuarioForm = form(this.model, (campo)=>{
    required(campo.nombre, { message: 'El nombre es obligatorio.'});
    minLength(campo.nombre, 3, { message: 'El nombre debe tener al menos 3 caracteres.'});

    required(campo.apellido, { message: 'El apellido es obligatorio.'});
    minLength(campo.apellido, 3, { message: 'El apellido debe tener al menos 3 caracteres.'});

    required(campo.dni, { message: 'El DNI es obligatorio.'});
    minLength(campo.dni, 7, { message: 'El DNI debe tener 7 u 8 dígitos.'});
    maxLength(campo.dni, 8, { message: 'El DNI debe tener 7 u 8 dígitos.'});

    required(campo.contacto.email, { message: 'El email es obligatorio.'});
    email(campo.contacto.email, { message: 'Ingrese un email válido.'});

    required(campo.contacto.telefono, { message: 'El teléfono es obligatorio.'});
    minLength(campo.contacto.telefono, 8, { message: 'Mínimo 8 caracteres.'});
    maxLength(campo.contacto.telefono, 15, { message: 'Máximo 15 caracteres'});

    required(campo.role);

    if (!this.esEdicion){
      required(campo.username, {message: 'El usuario es obligatorio.'});
      minLength(campo.username, 3, { message: 'Mínimo 3 caracteres.' });

      required(campo.password, { message: 'La contraseña es obligatoria.' });
      minLength(campo.password, 8, { message: 'Mínimo 8 caracteres.' });
    }
  });

  cargando = signal(false);
  error = signal('');

  constructor(){
    if(this.id !== null){
      this.uService.obtener(Number(this.id)).subscribe({
        next: (u) =>
          this.model.set({
            nombre: u.nombre,
            apellido: u.apellido,
            dni: u.dni,
            matricula: esProfesional(u) ? u.matricula : '',
            contacto: { email: u.contacto.email, telefono: u.contacto.telefono },
            username: '',
            password: '',
            role: u.role,
          }),
        error: () => this.error.set('No se pudo cargar el usuario.'),
      });
    }
  }

  private rutaLista(esProf: boolean){
    return ['/admin', esProf ?'profesionales': 'usuarios'];
  }

  onSubmit(event: Event): void{
    event.preventDefault();

    if(this.usuarioForm().invalid()) {
      return;
    }

    const v = this.model();
    const esProf = v.role === Roles.ROLE_PROFESIONAL;
    const matricula = v.matricula.trim();

    if(esProf && !matricula) {
      this.error.set('La matrícula es obligatoria para los profesionales.');
      return;
    }

    this.cargando.set(true);
    this.error.set('');

    const contacto = { email: v.contacto.email, telefono: v.contacto.telefono };
    let peticion: Observable<Usuario>;

    if (this.esEdicion) {
      const id = Number(this.id);
      peticion = esProf
        ? this.uService.actualizarProfesional(id, {
            nombre: v.nombre, apellido: v.apellido, dni: v.dni,
            matricula, contacto, role: v.role,
          })
        : this.uService.actualizarUsuario(id, {
            nombre: v.nombre, apellido: v.apellido, dni: v.dni,
            contacto, role: v.role,
          });
    } else {
      const cuenta: CuentaNuevaPedido = { ...v, matricula: esProf ? matricula : null };
      peticion = esProf
        ? this.uService.guardarProfesional(cuenta)
        : this.uService.guardarUsuario(cuenta);
    }

    peticion.subscribe({
      next: () => this.router.navigate(this.rutaLista(esProf)),
      error: (e) => {
        this.error.set(e.error?.message || 'No se pudo guardar el usuario.');
        this.cargando.set(false);
      },
    });
  }

  get listaActual(): string[]{
    return this.rutaLista(this.model().role === Roles.ROLE_PROFESIONAL);
  }

}
