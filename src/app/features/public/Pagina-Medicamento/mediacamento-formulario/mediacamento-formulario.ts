import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { form, FormField, min, minLength, required } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Medicamento, MedicamentoNuevo } from '../Model/Medicamento';
import { MedicamentoService } from '../Service/medicamento-service';

@Component({
  imports: [CommonModule, RouterModule, FormField],
  selector: 'app-mediacamento-formulario',
  styleUrl: './mediacamento-formulario.css',
  templateUrl: './mediacamento-formulario.html',
})
export class MediacamentoFormulario {
  medID?: number;
  private route = inject(ActivatedRoute);
  protected base= this.route.snapshot.data['base'];

  medicamentoModel= signal<MedicamentoNuevo>({
    nombre: '',
    principioActivo: '',
    laboratorio: '',
    descripcion: '',
    stock: 0,
    precio: 0,
    fechaVencimiento: ''
  });

  medForm = form(this.medicamentoModel, (campo)=>{
    required(campo.nombre, { message: 'El nombre es obligatorio.' });
    minLength(campo.nombre, 2, { message: 'El nombre debe tener al menos 2 caracteres.' });

    required(campo.principioActivo, { message: 'El principio activo es obligatorio.' });
    required(campo.laboratorio, { message: 'El laboratorio es obligatorio.' });

    required(campo.stock, { message: 'El stock es obligatorio.' });
    min(campo.stock, 0, { message: 'El stock no puede ser negativo.' });

    required(campo.precio, { message: 'El precio es obligatorio.' });
    min(campo.precio, 0.01, { message: 'El precio debe ser mayor que cero.' });

    required(campo.fechaVencimiento, { message: 'La fecha de vencimiento es obligatoria.' });
  });

  cargando = signal(false);
  error = signal('');

  get esEdicion(){
    return this.medID !== undefined;
  }

  constructor(
    private mService: MedicamentoService,
    private router: Router
  ){}

  ngOnInit(): void{
    const id = this.route.snapshot.params['id'];

    if(id){
      this.medID = Number(id);

      this.mService.getMedicamento(this.medID).subscribe({
        next: (data) =>{
          this.medicamentoModel.set({
            nombre: data.nombre,
            principioActivo: data.principioActivo,
            laboratorio: data.laboratorio,
            descripcion: data.descripcion,
            stock: data.stock,
            precio: data.precio,
            fechaVencimiento: data.fechaVencimiento,
          });
        },
        error: (e)=> this.error.set(e.error?.message || 'No se pudo cargar el medicamento.'),
      });
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    if (this.medForm().invalid()) {
      this.medForm().markAsTouched();
      return;
    }

    this.cargando.set(true);
    this.error.set('');

    const datos = this.medicamentoModel();

    const peticion = this.medID
      ? this.mService.actualizarMedicamento(this.medID, {
          nombre: datos.nombre,
          principioActivo: datos.principioActivo,
          laboratorio: datos.laboratorio,
          descripcion: datos.descripcion,
          stock: datos.stock,
          precio: datos.precio,
        })
      : this.mService.guardarMedicamento(datos);

    peticion.subscribe({
      next: () => {
        alert(this.medID
          ? 'Medicamento actualizado correctamente.'
          : 'Medicamento creado correctamente.');
        this.router.navigate([this.base, 'medicamentos']);
      },
      error: (e) => {
        this.error.set(e.error?.message || 'No se pudo guardar el medicamento.');
        this.cargando.set(false);
      },
    });
  }
}