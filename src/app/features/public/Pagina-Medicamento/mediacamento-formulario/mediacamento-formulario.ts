import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { form, FormField, min, minLength, required, validate } from '@angular/forms/signals';
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

  medicamentosExistentes = signal<Medicamento[]>([]);

  readonly fechaMinima = (() => {
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    const mes = String(manana.getMonth() + 1).padStart(2, '0');
    const dia = String(manana.getDate()).padStart(2, '0');
    return `${manana.getFullYear()}-${mes}-${dia}`;
  })();

  medForm = form(this.medicamentoModel, (campo)=>{
    required(campo.nombre, { message: 'El nombre es obligatorio.' });
    minLength(campo.nombre, 2, { message: 'El nombre debe tener al menos 2 caracteres.' });

    validate(campo.nombre, ({ value, valueOf }) => {
      const nombre = (value() ?? '').trim();
      const laboratorio = (valueOf(campo.laboratorio) ?? '').trim();
      const descripcion = (valueOf(campo.descripcion) ?? '').trim();

      if (!nombre || !laboratorio || !descripcion) return null;

      const duplicado = this.medicamentosExistentes().some(med =>
        med.id !== this.medID
        && med.nombre.trim().toLowerCase() === nombre.toLowerCase()
        && med.laboratorio.trim().toLowerCase() === laboratorio.toLowerCase()
        && med.descripcion.trim().toLowerCase() === descripcion.toLowerCase()
      );

      return duplicado
        ? {
            kind: 'duplicado',
            message: 'Ya existe un medicamento con ese nombre, laboratorio y descripción.'
          }
        : null;
    });

    required(campo.principioActivo, { message: 'El principio activo es obligatorio.' });
    minLength(campo.principioActivo, 2, { message: 'El principio activo debe tener al menos 2 caracteres.' });

    required(campo.laboratorio, { message: 'El laboratorio es obligatorio.' });
    minLength(campo.laboratorio, 2, { message: 'El laboratorio debe tener al menos 2 caracteres.' });

    required(campo.descripcion, { message: 'La descripción es obligatoria.' });
    minLength(campo.descripcion, 10, { message: 'La descripción debe tener al menos 10 caracteres.' });

    required(campo.stock, { message: 'El stock es obligatorio.' });
    min(campo.stock, 1, { message: 'El stock debe ser al menos 1.' });

    required(campo.precio, { message: 'El precio es obligatorio.' });
    min(campo.precio, 0.01, { message: 'El precio debe ser mayor que cero (0) pesos.' });

    required(campo.fechaVencimiento, { message: 'La fecha de vencimiento es obligatoria.' });
    validate(campo.fechaVencimiento, ({ value }) => {
      // En edición el campo no se muestra y la fecha original ya pasó.
      if (this.medID !== undefined) return null;

      const fecha = value();
      if (!fecha) return null;

      return fecha >= this.fechaMinima
        ? null
        : {
            kind: 'fechaVencida',
            message: 'La fecha de vencimiento debe ser posterior al día de hoy.'
          };
    });
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
    this.mService.getMedicamentos().subscribe({
      next: (data) => this.medicamentosExistentes.set(data),
      error: () => this.medicamentosExistentes.set([]),
    });

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
        error: (e)=> this.error.set(
          e.error?.mensaje ?? e.error?.message ?? 'No se pudo cargar el medicamento.'
        ),
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
        this.error.set(
          e.error?.mensaje ?? e.error?.message ?? 'No se pudo guardar el medicamento.'
        );
        this.cargando.set(false);
      },
    });
  }
}