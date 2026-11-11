import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { form, FormField, min, required } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Pago, PagoNuevo } from '../Model/Pago';
import { PagoService } from '../Service/pago-service';

@Component({
  imports: [CommonModule, RouterModule, FormField],
  selector: 'app-pago-formulario',
  styleUrl: './pago-formulario.css',
  templateUrl: './pago-formulario.html',
})
export class PagoFormulario {
    pagoId?: number;
    private route= inject(ActivatedRoute);

    private base = this.route.snapshot.data['basePago'];

    pagoModel = signal<PagoNuevo>({
      monto: 0,
      fecha: '',
      idsPacientes: []
    });

    pagoForm = form(this.pagoModel, (campo)=>{
      required(campo.monto, {message: 'El monto es obligatorio.'});
      min(campo.monto, 1, {message:'El monto minimo es de un (1) peso.'});

      required(campo.fecha, {message: 'La fecha es obligatoria.'});

      required(campo.idsPacientes, {message: 'Es obligatiorio que un pago se relacione con un paciente.'});
    });

    cargando = signal(false);
    error= signal('');

    constructor(
      private paService: PagoService,
      private router: Router
    ){}

    ngOnInt(): void{
      const id = this.route.snapshot.params['id'];

      if(id){
        this.pagoId=Number(id);

        /*this.paService.getPago(this.pagoId).subscribe({
          next: (data)=>{
            this.pagoModel.set({
              monto: data.monto,
              fecha: data.fecha,
              idsPacientes: data.idsPacientes.map(pa=>pa.id)
            })
          },
          error: (e)=>{
            this.error.set(e.error?.message || 'No se pudo cargar el pago.')
          }
        })
      */
      }
    }

    onSubmit(event: Event): void{
      event.preventDefault();

      if(this.pagoForm().invalid()){
        this.pagoForm().markAsTouched();
        return;
      }

      const pagoData = this.pagoModel();

      this.cargando.set(true);
      this.error.set('');

      this.paService.guardarPago(pagoData).subscribe({
        next: ()=>{
          alert('Pago guardado correctamente.');
          this.router.navigate([this.base]);
        },
        error: (e)=>{
          this.error.set(e.error?.message || 'No se pudo gaurdar el pago.');
          this.cargando.set(false);
        }
      });
    }

    agregarPaciente(id: number, seleccionado: boolean): void {
    this.pagoModel.update(pago => ({
        ...pago,
        idsPacientes: seleccionado
            ? [...pago.idsPacientes, id]
            : pago.idsPacientes.filter(paId => paId !== id)
    }));
}


}
