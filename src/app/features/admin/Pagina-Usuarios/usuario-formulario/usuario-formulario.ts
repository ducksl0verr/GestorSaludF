import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { email, form, FormField, maxLength, minLength, required } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Usuario } from '../models/Usuario';
import { Roles } from '../../../public/enums/Roles';
import { UsuarioService } from '../service/usuario-service';

@Component({
  imports: [CommonModule, RouterModule, FormField],
  selector: 'app-usuario-formulario',
  styleUrl: './usuario-formulario.css',
  templateUrl: './usuario-formulario.html',
})
export class UsuarioFormulario implements OnInit {

  usuarioId!: number;

  usuarioModel=signal<Usuario>({
    nombre: '',
    apellido: '',
    dni: '',
    contacto: {
      email: '',
      telefono: ''
    },
    role: Roles.ROLE_PROFESIONAL
  });

  usuarioForm = form(this.usuarioModel, (campo)=>{
    required(campo.nombre, { message: 'El nombre es obligatorio.'});
    minLength(campo.nombre, 3, { message: 'El nombre debe tener al menos 3 caracteres.'});

    required(campo.apellido, { message: 'El apellido es obligatorio.'});
    minLength(campo.apellido, 3, { message: 'El apellido debe tener al menos 3 caracteres.'});

    required(campo.dni, { message: 'El DNI es obligatorio.'});
    minLength(campo.dni, 7, { message: 'El DNI debe tener 7 u 8 dígitos.'});
    maxLength(campo.dni, 8, { message: 'El DNI debe tener 7 u 8 dígitos.'});

    // Validaciones del objeto contacto
    required(campo.contacto.email, { message: 'El email es obligatorio.'});
    email(campo.contacto.email, { message: 'Ingrese un email válido.'});

    required(campo.contacto.telefono, { message: 'El teléfono es obligatorio.'});
    minLength(campo.contacto.telefono, 8, { message: 'Mínimo 8 caracteres.'});
    maxLength(campo.contacto.telefono, 15, { message: 'Máximo 15 caracteres'});
    //Cierre

    required(campo.role);
  });

  constructor(
    private uService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ){}

  ngOnInit(): void {
    this.usuarioId= this.route.snapshot.params['id'];

    if(this.usuarioId){
      this.uService.getUsuario(this.usuarioId)
        .subscribe(data=>{
          this.usuarioModel.set({
          nombre: data.nombre,
          apellido: data.apellido,
          dni: data.dni,
          contacto: {
            email: data.contacto.email,
            telefono: data.contacto.telefono
          },
          role: data.role
        });
      });
    }
  }

  onSubmit(event: Event): void {
      
      event.preventDefault();
  
      if(this.usuarioForm().invalid()){
        console.log('Formulario inválido.');
        this.usuarioForm().markAsTouched();
        return;
      }
  
      const userdata = this.usuarioModel();

      if(this.usuarioId){
        const user: Usuario={
          id: this.usuarioId,
          ... userdata
        };
      }
    }

}
