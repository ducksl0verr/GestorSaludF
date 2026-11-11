import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { applyEach, email, form, FormField, maxLength, minLength, pattern, required } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Proveedor, ProveedorNuevo } from '../model/Proveedor';
import { TipoProveedor } from '../enums/TipoProveedor';
import { Contacto } from '../../contacto/contacto';
import { ProveedorService } from '../Service/proveedor-service';

@Component({
  imports: [CommonModule, RouterModule, FormField],
  selector: 'app-proveedor-formulario',
  styleUrl: './proveedor-formulario.css',
  templateUrl: './proveedor-formulario.html',
})
export class ProveedorFormulario {
  proveedorId?: number;
  readonly TipoProveedor = TipoProveedor;
  private route= inject(ActivatedRoute);
  
  private base = this.route.snapshot.data['baseProveedores'];

  proveedorModel= signal<ProveedorNuevo>({
    nombre: '',
    contacto: {
      email: '',
      telefono: ''
    },
    cuil: '',
    direccion: [],
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
  
    minLength(campo.direccion, 1, { message: 'El proveedor debe tener al menos un domicilio.'});

    applyEach(campo.direccion, (domicilio)=>{
      required(domicilio.calle);
      minLength(domicilio.calle, 2, {
        message: 'La calle debe tener al menos 2 caracteres.'
      });
      
      required(domicilio.numero);

      required(domicilio.codigo_postal);
      pattern(domicilio.codigo_postal, /^[A-Z]?\d{4}[A-Z]{0,3}$/i, {
      message: 'El código postal no tiene un formato válido.'
      });

      maxLength(domicilio.depto, 10, {
      message: 'El departamento no puede superar los 10 caracteres.'
      });
      
      required(domicilio.provincia);
            
      required(domicilio.localidad);
    })

    required(campo.tipo, { message: 'El proveedor debe tener un tipo.' })

  });

  cargando = signal(false);
  error = signal('');

  agregarDomicilio() {
    this.proveedorModel.update(proveedor => ({
      ...proveedor,
      direccion: [
        ...proveedor.direccion,
        {
          calle: "",
          numero: "",
          codigo_postal: "",
          depto:"",
          piso:"",
          provincia:"",
          localidad: ""
        }
      ]
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

      this.pService.getProveedor(this.proveedorId)
        .subscribe({
          next: (data)=>{
          this.proveedorModel.set({
          nombre: data.nombre,
          contacto: {
            ...data.contacto
          },
          cuil: data.cuil,
          direccion: data.direccion.map(dom=>({
            ...dom
          })),
          tipo: data.tipo
        });
      },
      error: (e)=>{
        this.error.set(e.error?.message || 'No se pudo cargar el proveedor.')
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
          this.router.navigate([this.base]);
        },
        error: (e)=> {
          this.error.set(e.error?.message || 'No se pudo guardar el proveedor.');
          this.cargando.set(false);
        }
      });
    } else{
      this.pService.guardarProveedor(proveedorData).subscribe({
        next: ()=>{
          alert('Proovedor guardado correctamente.');
          this.router.navigate([this.base]);
        },
        error: (e)=> {
          this.error.set(e.error?.message || 'No se pudo guardar el usuario.');
          this.cargando.set(false);
        }
      });
    }
  }

}
