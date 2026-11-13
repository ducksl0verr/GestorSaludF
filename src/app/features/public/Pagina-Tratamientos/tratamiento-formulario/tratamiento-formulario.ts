import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TratamientoNuevo } from '../Model/Tratamiento';
import { applyEach, form, FormField, maxLength, min, minLength, pattern, required } from '@angular/forms/signals';
import { TratamientoService } from '../Service/tratamiento-service';
import { CommonModule } from '@angular/common';

@Component({
  imports: [FormField, CommonModule, RouterModule],
  selector: 'app-tratamiento-formulario',
  styleUrl: './tratamiento-formulario.css',
  templateUrl: './tratamiento-formulario.html',
})
export class TratamientoFormulario {
    tratamientoId?: number;
    private route= inject(ActivatedRoute);
    
    protected base = this.route.snapshot.data['base'];
  
    tratamientoModel= signal<TratamientoNuevo>({
      nombre: '',
      descripcion:'',
      precio: 0
    });
  
    tratamientoForm = form(this.tratamientoModel, (campo)=>{
      required(campo.nombre, { message: 'El nombre es obligatorio.'});
      minLength(campo.nombre, 3, { message: 'El nombre debe tener al menos 3 caracteres.'});
      
      required(campo.descripcion, { message: 'La descripcion es obligatoria.'});
      minLength(campo.descripcion, 3, { message: 'Por favor, ingrese una descripcipón mayor a 3 caracteres.'});

      required(campo.precio, {message: 'El precio es obligatorio.'});
      min(campo.precio, 1, {message: 'El precio debe ser al menos un (1) peso.'})
    });
  
    cargando = signal(false);
    error = signal('');
  
    constructor(
      private tService: TratamientoService,
      private router: Router
    ){}
  
    ngOnInit(): void {
      const id = this.route.snapshot.params['id'];
  
      if(id){
        this.tratamientoId = Number(id);
  
        this.tService.getTratamiento(this.tratamientoId)
          .subscribe({
            next: (data)=>{
            this.tratamientoModel.set({
            nombre: data.nombre,
            descripcion: data.descripcion,
            precio: data.precio
            });
          },
          error: (e)=>{
            this.error.set(e.error?.message || 'No se pudo cargar el tratamiento.')
          }});
      }
    }
    
    onSubmit(event: Event): void{
      event.preventDefault();
  
      if(this.tratamientoForm().invalid()){
        this.tratamientoForm().markAsTouched();
        return;
      }
  
      const tratamientoData = this.tratamientoModel();
      
  
      this.cargando.set(true);
      this.error.set('');
  
      if(this.tratamientoId){
        this.tService.actualizarTratamiento(this.tratamientoId, tratamientoData).subscribe({
          next: ()=>{
            alert('Tratamiento actualizado correctamente.');
            this.router.navigate([this.base, 'tratamientos']);
          },
          error: (e)=> {
            this.error.set(e.error?.message || 'No se pudo guardar el tratamiento.');
            this.cargando.set(false);
          }
        });
      } else{
        this.tService.guardarTratamiento(tratamientoData).subscribe({
          next: ()=>{
            alert('Tratamiento actualizado correctamente.');
            this.router.navigate([this.base, 'tratamientos']);
          },
          error: (e)=> {
            this.error.set(e.error?.message || 'No se pudo guardar el tratamiento.');
            this.cargando.set(false);
          }
        });
      }
    }

}
