import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { applyEach, disabled, email, form, FormField, maxLength, minLength, pattern, required } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Proveedor, ProveedorNuevo } from '../model/Proveedor';
import { TipoProveedor } from '../enums/TipoProveedor';
import { Contacto } from '../../contacto/contacto';
import { ProveedorService } from '../Service/proveedor-service';
import { mensajeDeError } from '../../../../core/utils/mensaje-error';

@Component({
  imports: [CommonModule, RouterModule, FormField],
  selector: 'app-proveedor-formulario',
  styleUrl: './proveedor-formulario.css',
  templateUrl: './proveedor-formulario.html',
})
export class ProveedorFormulario {
  proveedorId?: number;
  readonly esEdicion = signal(false);
  readonly TipoProveedor = TipoProveedor;
  private route= inject(ActivatedRoute);
  
  private base = this.route.snapshot.data['base'];

  proveedorModel= signal<ProveedorNuevo>({
    nombre: '',
    contacto: {
      email: '',
      telefono: ''
    },
    cuil: '',
    direccion: [this.domicilioVacio()],
    tipo: TipoProveedor.MEDICAMENTOS
  });

  proveedorForm = form(this.proveedorModel, (campo)=>{
    required(campo.nombre, { message: 'El nombre es obligatorio.'});
    minLength(campo.nombre, 3, { message: 'El nombre debe tener al menos 3 caracteres.'});

    required(campo.contacto.email, { message: 'El email es obligatorio.'});
    email(campo.contacto.email, { message: 'Ingrese un email válido.'});

    required(campo.contacto.telefono, { message: 'El teléfono es obligatorio.'});
    minLength(campo.contacto.telefono, 8, { message: 'Mínimo 8 caracteres.'});
    maxLength(campo.contacto.telefono, 15, { message: 'Máximo 15 caracteres'});

    required(campo.cuil, { message: 'El cuil es obligatorio.' });
    maxLength(campo.cuil, 11, { message: 'El cuil debe contener maximo 11 digitos.' });
    disabled(campo.cuil, { when: () => this.esEdicion() });
  
    minLength(campo.direccion, 1, { message: 'El proveedor debe tener al menos un domicilio.'});

    applyEach(campo.direccion, (domicilio)=>{
      required(domicilio.calle, { message: 'La calle es obligatoria.' });
      minLength(domicilio.calle, 2, {
        message: 'La calle debe tener al menos 2 caracteres.'
      });
      
      required(domicilio.numero, { message: 'El número es obligatorio.' });

      required(domicilio.codigo_postal, { message: 'El código postal es obligatorio.' });
      pattern(domicilio.codigo_postal, /^[A-Z]?\d{4}[A-Z]{0,3}$/i, {
      message: 'El código postal no tiene un formato válido.'
      });

      maxLength(domicilio.depto, 10, {
      message: 'El departamento no puede superar los 10 caracteres.'
      });
      
      required(domicilio.provincia, { message: 'La provincia es obligatoria.' });
            
      required(domicilio.localidad, { message: 'La localidad es obligatoria.' });
    })

    required(campo.tipo, { message: 'El proveedor debe tener un tipo.' });
    disabled(campo.tipo, { when: () => this.esEdicion() });

  });

  cargando = signal(false);
  error = signal('');

  private domicilioVacio() {
    return {
      calle: "",
      numero: "",
      codigo_postal: "",
      depto: "",
      piso: "",
      provincia: "",
      localidad: ""
    };
  }

  agregarDomicilio() {
    this.proveedorModel.update(proveedor => ({
      ...proveedor,
      direccion: [...proveedor.direccion, this.domicilioVacio()]
    }));
  }

  eliminarDomicilio(index: number): void {
    this.proveedorModel.update(proveedor => ({
      ...proveedor,
      direccion: proveedor.direccion.filter(
        (_, i) => i !== index
      )
    }));
  }

  constructor(
    private pService: ProveedorService,
    private router: Router
  ){}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];

    if(id){
      this.proveedorId = Number(id);
      this.esEdicion.set(true);

      this.pService.getProveedor(this.proveedorId)
        .subscribe({
          next: (data)=>{
          this.proveedorModel.set({
          nombre: data.nombre,
          contacto: {
            ...data.contacto
          },
          cuil: data.cuil,
          direccion: data.direccion?.length
            ? data.direccion.map(dom => ({ ...dom }))
            : [this.domicilioVacio()],
          tipo: data.tipo
        });
      },
      error: (e)=>{
        this.error.set(mensajeDeError(e, 'No se pudo cargar el proveedor.'))
      }});
    }
  }
  
  onSubmit(event: Event): void{
    event.preventDefault();

    if(this.proveedorForm().invalid()){
      this.proveedorForm().markAsTouched();
      return;
    }

    const proveedorData = this.proveedorModel();
    

    this.cargando.set(true);
    this.error.set('');

    if(this.proveedorId){
      this.pService.actualizarProveedor(this.proveedorId, proveedorData).subscribe({
        next: ()=>{
          alert('Proveedor actualizado correctamente.');
          this.router.navigate([this.base, 'proveedores']);
        },
        error: (e)=> {
          this.error.set(mensajeDeError(e, 'No se pudo guardar el proveedor.'));
          this.cargando.set(false);
        }
      });
    } else{
      this.pService.guardarProveedor(proveedorData).subscribe({
        next: ()=>{
          alert('Proovedor actualizado correctamente.');
          this.router.navigate([this.base, 'proveedores']);
        },
        error: (e)=> {
          this.error.set(mensajeDeError(e, 'No se pudo guardar el proveedor.'));
          this.cargando.set(false);
        }
      });
    }
  }

}
