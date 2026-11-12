import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProveedorService } from '../../Service/proveedor-service';
import { Mensaje } from '../Model/Mensaje';
import { form, FormField, required } from '@angular/forms/signals';

@Component({
  imports: [FormField, RouterLink],
  selector: 'app-email-formulario',
  styleUrl: './email-formulario.css',
  templateUrl: './email-formulario.html',
})
export class EmailFormulario {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pService = inject(ProveedorService);

  private base = this.route.snapshot.data['base'];
  private proveedorId = Number(this.route.snapshot.params['id']);

  mensajeModel = signal<Mensaje>({
    asunto: '',
    mensaje: ''
  });

  mensajeForm = form(this.mensajeModel, (campo)=>{
    required(campo.asunto, { message: 'El asunto es obligatorio.' });
    required(campo.mensaje, { message: 'El mensaje es obligatorio.' });
  });

  cargando = signal(false);
  error= signal('');

  onSubmit(event: Event){
    event.preventDefault();

    if(this.mensajeForm().invalid()){
      this.mensajeForm().markAsTouched();
      return;
    }

    this.cargando.set(true);
    this.error.set('');

    this.pService.enviarMensaje(this.proveedorId, this.mensajeModel()).subscribe({
      next: ()=>{
        alert('Mensaje enviado correctamente.');
        this.router.navigate([this.base, 'proveedores', this.proveedorId]);
      },
      error: (e)=>{
        this.error.set(e.error?.message || 'No se pudo enviar el mensaje.');
        this.cargando.set(false);
      }
    });
  }


}
