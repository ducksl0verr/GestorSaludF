import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteService } from '../services/paciente-service';
import { ObraSocialService } from '../../../public/Pagina-ObraSocial/Service/obra-social-service';
import { Obra_Social } from '../../../public/Pagina-ObraSocial/Model/Obra_Social';
import { email, form, FormField, maxLength, min, minLength, required } from '@angular/forms/signals';
import { RouterModule } from '@angular/router';
import { PacienteNuevo } from '../models/paciente-nuevo';
import { PacienteActualizar } from '../models/paciente-actualizar';
import { Paciente } from '../models/paciente';
import { mensajeDeError } from '../../../../core/utils/mensaje-error';

@Component({
  imports: [CommonModule, RouterModule, FormField],
  selector: 'app-paciente-formulario',
  styleUrl: './paciente-formulario.css',
  templateUrl: './paciente-formulario.html',
})
export class PacienteFormulario implements OnInit{

  id?: number;
  private route = inject(ActivatedRoute);
  protected base = this.route.snapshot.data['base'];

  error = signal('');

  obrasSociales = signal<Obra_Social[]>([]);

  /**
   * Caracteres que NO se permiten (se eliminan al tipear) por cada campo.
   * \p{L} = cualquier letra (con tildes/ñ), \p{N} = cualquier número.
   */
  private readonly patrones: Record<string, RegExp> = {
    'nombre':                    /[^\p{L}\s'-]/gu,            // solo letras
    'apellido':                  /[^\p{L}\s'-]/gu,            // solo letras
    'dni':                       /[^0-9]/g,                   // solo números
    'contacto.telefono':         /[^0-9+]/g,                  // números y +
    'contacto.email':            /[^A-Za-z0-9@._+-]/g,        // caracteres de email
    'domicilio.calle':           /[^\p{L}\p{N}\s.,'-]/gu,     // letras, números, espacios
    'domicilio.numero':          /[^0-9A-Za-z]/g,             // alfanumérico
    'domicilio.piso':            /[^0-9A-Za-z]/g,             // alfanumérico
    'domicilio.depto':           /[^0-9A-Za-z]/g,             // alfanumérico
    'domicilio.localidad':       /[^\p{L}\p{N}\s'-]/gu,       // letras y números
    'domicilio.provincia':       /[^\p{L}\s'-]/gu,            // solo letras
    'domicilio.codigo_postal':   /[^0-9A-Za-z]/g,             // alfanumérico
  };

  /**
   * Elimina del input los caracteres que el campo no admite
   * y sincroniza la señal del formulario con el valor ya filtrado.
   */
  restringir(event: Event, ruta: string): void {
    const patron = this.patrones[ruta];
    if (!patron) return;

    const input = event.target as HTMLInputElement;
    const limpio = input.value.replace(patron, '');

    if (limpio !== input.value) {
      input.value = limpio;
    }

    this.escribir(ruta, limpio);
  }

  private escribir(ruta: string, valor: string): void {
    this.pacienteModel.update(model => {
      if (!ruta.includes('.')) {
        return { ...model, [ruta]: valor } as PacienteNuevo;
      }

      const [padre, hijo] = ruta.split('.');
      const anidado = { ...(model as Record<string, any>)[padre], [hijo]: valor };

      return { ...model, [padre]: anidado } as PacienteNuevo;
    });
  }

  constructor(
    private servicioPaciente: PacienteService,
    private servicioObraSocial: ObraSocialService,
    private router : Router) {}


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
    maxLength(campo.nombre, 50, {message: 'El nombre no puede superar los 50 caracteres'});

    required(campo.apellido, {message: 'El apellido es obligatorio'});
    minLength(campo.apellido, 3, {message: 'El apellido debe tener al menos 3 caracteres'});
    maxLength(campo.apellido, 50, {message: 'El apellido no puede superar los 50 caracteres'});

    required(campo.fecha_nacimiento, {message: 'La fecha de nacimiento es obligatoria'});

    required(campo.dni, {message: 'El DNI es obligatorio'});
    minLength(campo.dni, 7, {message: 'El DNI debe tener al menos 7 caracteres'});
    maxLength(campo.dni, 20, {message: 'El DNI no puede superar los 20 caracteres'});

    required(campo.numeroAfiliado, {message: 'El número de afiliado es obligatorio'});
    min(campo.numeroAfiliado, 1, {message: 'El número de afiliado debe ser mayor a cero'});

    required(campo.domicilio.calle, {message: 'La calle es obligatoria'});
    minLength(campo.domicilio.calle, 3, {message: 'La calle debe tener al menos 3 caracteres'});
    maxLength(campo.domicilio.calle, 50, {message: 'La calle no puede superar los 50 caracteres'});

    required(campo.domicilio.numero, {message: 'El número es obligatorio'});
    minLength(campo.domicilio.numero, 1, {message: 'El número debe tener al menos 1 carácter'});
    maxLength(campo.domicilio.numero, 50, {message: 'El número no puede superar los 50 caracteres'});

    required(campo.domicilio.localidad, {message: 'La localidad es obligatoria'});
    minLength(campo.domicilio.localidad, 3, {message: 'La localidad debe tener al menos 3 caracteres'});
    maxLength(campo.domicilio.localidad, 50, {message: 'La localidad no puede superar los 50 caracteres'});

    required(campo.domicilio.provincia, {message: 'La provincia es obligatoria'});
    minLength(campo.domicilio.provincia, 3, {message: 'La provincia debe tener al menos 3 caracteres'});
    maxLength(campo.domicilio.provincia, 50, {message: 'La provincia no puede superar los 50 caracteres'});

    required(campo.domicilio.codigo_postal, {message: 'El código postal es obligatorio'});
    minLength(campo.domicilio.codigo_postal, 4, {message: 'El código postal debe tener al menos 4 caracteres'});
    maxLength(campo.domicilio.codigo_postal, 50, {message: 'El código postal no puede superar los 50 caracteres'});

    maxLength(campo.domicilio.piso, 50, {message: 'El piso no puede superar los 50 caracteres'});
    maxLength(campo.domicilio.depto, 50, {message: 'El departamento no puede superar los 50 caracteres'});

    required(campo.id_obraSocial, {message: 'Debe seleccionar una obra social'});
    min(campo.id_obraSocial, 1, {message: 'Debe seleccionar una obra social'});

    required(campo.contacto.telefono, {message: 'El teléfono es obligatorio'});
    minLength(campo.contacto.telefono, 7, {message: 'El teléfono debe tener al menos 7 caracteres'});
    maxLength(campo.contacto.telefono, 20, {message: 'El teléfono no puede superar los 20 caracteres'});

    required(campo.contacto.email, {message: 'El email es obligatorio'});
    email(campo.contacto.email, {message: 'Ingrese un email válido'});
    maxLength(campo.contacto.email, 100, {message: 'El email no puede superar los 100 caracteres'});
  });




  ngOnInit(): void {

    this.servicioObraSocial.getObrasSociales().subscribe({
        next: (obras) => this.obrasSociales.set(obras),
        error: (error) => console.error('Error al cargar las obras sociales', error)
    });

    const id = this.route.snapshot.params['id'];

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
                        piso: data.domicilio.piso ?? '',
                        depto: data.domicilio.depto ?? '',
                        numero: data.domicilio.numero,
                        localidad: data.domicilio.localidad,
                        provincia: data.domicilio.provincia,
                        codigo_postal: data.domicilio.codigo_postal,

                    },
                    id_obraSocial: data.id_obraSocial,
                    contacto: {
                        telefono: data.contacto.telefono,
                        email: data.contacto.email,
                    },
                });
            },
            error: (error) => {
                this.error.set(mensajeDeError(error, 'No se pudo cargar el paciente.'));
            }
        });
    }
}




guardarPaciente(): void {

    if (this.pacienteForm().invalid()) {
        this.pacienteForm().markAsTouched();
        return;
    }

    this.error.set('');

    const datos = this.pacienteModel();

    const domicilio = {
        ...datos.domicilio,
        piso: datos.domicilio.piso ?? '',
        depto: datos.domicilio.depto ?? ''
    };

    // Chequeo previo de duplicados (DNI, email, teléfono) contra el listado actual.
    // Si el listado no se puede cargar, se envía igual: el backend valida igualmente.
    this.servicioPaciente.getPacientes().subscribe({
        next: (pacientes) => {
            const duplicado = this.buscarDuplicado(pacientes, datos);

            if (duplicado) {
                this.error.set(duplicado);
                return;
            }

            this.enviarPaciente(datos, domicilio);
        },
        error: () => this.enviarPaciente(datos, domicilio)
    });
}


private buscarDuplicado(pacientes: Paciente[], datos: PacienteNuevo): string {

    const dni = datos.dni.trim();
    const email = datos.contacto.email.trim().toLowerCase();
    const telefono = datos.contacto.telefono.trim();

    const dniRepetido = pacientes.some(p => p.id !== this.id && p.dni?.trim() === dni);
    if (dniRepetido) {
        return `Ya existe un paciente con ese DNI: ${dni}`;
    }

    const emailRepetido = pacientes.some(p =>
        p.id !== this.id && (p.contacto?.email ?? '').trim().toLowerCase() === email
    );
    if (emailRepetido) {
        return `Ya existe un paciente con este email: ${datos.contacto.email}`;
    }

    const telefonoRepetido = pacientes.some(p =>
        p.id !== this.id && (p.contacto?.telefono ?? '').trim() === telefono
    );
    if (telefonoRepetido) {
        return `Ya existe un paciente con este teléfono: ${datos.contacto.telefono}`;
    }

    return '';
}


private enviarPaciente(datos: PacienteNuevo, domicilio: PacienteNuevo['domicilio']): void {

    if (this.id) {

        const pacienteActualizar: PacienteActualizar = {
            nombre: datos.nombre,
            apellido: datos.apellido,
            fecha_nacimiento: datos.fecha_nacimiento,
            dni: datos.dni,
            numeroAfiliado: datos.numeroAfiliado,
            domicilio: domicilio,
            id_obraSocial: datos.id_obraSocial,
            contacto: datos.contacto
        };

        this.servicioPaciente.actualizarPaciente(this.id, pacienteActualizar).subscribe({
            next: () => {
                alert('Paciente actualizado correctamente');
                this.router.navigate([this.base, 'pacientes']);
            },
            error: (error) => {
                this.error.set(mensajeDeError(error, 'No se pudo actualizar el paciente.'));
            }
        });

    } else {

        this.servicioPaciente.registrarPaciente({ ...datos, domicilio: domicilio }).subscribe({
            next: () => {
                alert('Paciente registrado correctamente');
                this.router.navigate([this.base, 'pacientes']);
            },
            error: (error) => {
                this.error.set(mensajeDeError(error, 'No se pudo registrar el paciente.'));
            }
        });

    }
}

}
