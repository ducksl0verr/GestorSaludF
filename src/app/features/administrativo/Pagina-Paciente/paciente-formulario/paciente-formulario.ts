import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteService } from '../services/paciente-service';
import { form, FormField, min, minLength, required } from '@angular/forms/signals';
import { RouterModule } from '@angular/router';
import { PacienteNuevo } from '../models/paciente-nuevo';
import { PacienteActualizar } from '../models/paciente-actualizar';

@Component({
  imports: [CommonModule, RouterModule, FormField],
  selector: 'app-paciente-formulario',
  styleUrl: './paciente-formulario.css',
  templateUrl: './paciente-formulario.html',
})
export class PacienteFormulario implements OnInit{

  id?: number;

  constructor(private route: ActivatedRoute, private servicioPaciente: PacienteService, private router : Router) {}


  pacienteModel  = signal<PacienteNuevo>({
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    dni: '',
    numeroAfiliado: 0,
    domicilio:
    {
      calle: '',
      numero: '',
      piso: '',
      depto: '',
      localidad: '',
      provincia: '',
      codigo_postal: '',
      pais: '',
    },
     id_obraSocial: 0,
        contacto: {
          telefono: '',
          email: ''
        }
  })


  pacienteForm = form(this.pacienteModel,(campo) => {

    required(campo.nombre, {message: 'El nombre es obligatorio'});
    minLength(campo.nombre, 3, {message: 'El nombre debe tener al menos 3 caracteres'});

    required(campo.apellido, {message: 'El apellido es obligatorio'});
    minLength(campo.apellido, 3, {message: 'El apellido debe tener al menos 3 caracteres'});

    required(campo.fecha_nacimiento, {message: 'La fecha de nacimiento es obligatoria'});

    required(campo.dni, {message: 'El DNI es obligatorio'});
    minLength(campo.dni, 7, {message: 'El DNI debe tener al menos 7 caracteres'});

    required(campo.numeroAfiliado, {message: 'El número de afiliado es obligatorio'});
    min(campo.numeroAfiliado, 1, {message: 'El número de afiliado debe ser mayor a cero'});

    required(campo.domicilio.calle, {message: 'La calle es obligatoria'});
    minLength(campo.domicilio.calle, 3, {message: 'La calle debe tener al menos 3 caracteres'});

    required(campo.domicilio.piso, {message: 'El piso es obligatorio'});
    minLength(campo.domicilio.piso, 1, {message: 'El piso debe tener al menos 1 carácter'});

    required(campo.domicilio.depto, {message: 'El departamento es obligatorio'});
    minLength(campo.domicilio.depto, 1, {message: 'El departamento debe tener al menos 1 carácter'});

    required(campo.domicilio.numero, {message: 'El número es obligatorio'});
    minLength(campo.domicilio.numero, 1, {message: 'El número debe tener al menos 1 carácter'});

    required(campo.domicilio.localidad, {message: 'La localidad es obligatoria'});
    minLength(campo.domicilio.localidad, 3, {message: 'La localidad debe tener al menos 3 caracteres'});

    required(campo.domicilio.provincia, {message: 'La provincia es obligatoria'});
    minLength(campo.domicilio.provincia, 3, {message: 'La provincia debe tener al menos 3 caracteres'});

    required(campo.domicilio.codigo_postal, {message: 'El código postal es obligatorio'});
    minLength(campo.domicilio.codigo_postal, 4, {message: 'El código postal debe tener al menos 4 caracteres'});

    required(campo.domicilio.pais, {message: 'El país es obligatorio'});
    minLength(campo.domicilio.pais, 3, {message: 'El país debe tener al menos 3 caracteres'});

    required(campo.id_obraSocial, {message: 'La obra social es obligatoria'});

    required(campo.contacto.telefono, {message: 'El teléfono es obligatorio'});
    minLength(campo.contacto.telefono, 7, {message: 'El teléfono debe tener al menos 7 caracteres'});

    required(campo.contacto.email, {message: 'El email es obligatorio'});
    minLength(campo.contacto.email, 5, {message: 'El email debe tener al menos 5 caracteres'});
  });





  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
        this.id = Number(id);

        this.servicioPaciente.getPaciente(this.id).subscribe({
            next: (data) => {
                this.pacienteModel.set({
                    nombre: data.nombre,
                    apellido: data.apellido,
                    fecha_nacimiento: data.fecha_nacimiento,
                    dni: data.dni,
                    numeroAfiliado: data.numeroAfiliado,
                    domicilio: {
                        calle: data.domicilio.calle,
                        piso: data.domicilio.piso,
                        depto: data.domicilio.depto,
                        numero: data.domicilio.numero,
                        localidad: data.domicilio.localidad,
                        provincia: data.domicilio.provincia,
                        codigo_postal: data.domicilio.codigo_postal,
                        pais: '',
                    },
                    id_obraSocial: data.id_obraSocial,
                    contacto: {
                        telefono: data.contacto.telefono,
                        email: data.contacto.email,
                    },
                });
            },
            error: () => console.error('No se pudo cargar el paciente.')
        });
    }
}




guardarPaciente(): void {

    if (this.pacienteForm().invalid()) {
        return;
    }

    if (this.id) {

        const datos = this.pacienteModel();

        const pacienteActualizar: PacienteActualizar = {
            nombre: datos.nombre,
            apellido: datos.apellido,
            dni: datos.dni,
            numeroAfiliado: datos.numeroAfiliado,
            domicilio: datos.domicilio,
            id_obraSocial: datos.id_obraSocial,
            contacto: datos.contacto
        };

        this.servicioPaciente.actualizarPaciente(this.id, pacienteActualizar).subscribe({
            next: () => {
                alert('Paciente actualizado correctamente');
                this.router.navigate(['/administrativo', 'pacientes']);
            },
            error: () => alert('No se pudo actualizar el paciente')
        });

    } else {

        this.servicioPaciente.registrarPaciente(this.pacienteModel()).subscribe({
            next: () => {
                alert('Paciente registrado correctamente');
                this.router.navigate(['/administrativo', 'pacientes']);
            },
            error: () => alert('No se pudo registrar el paciente')
        });

    }
}






























}
