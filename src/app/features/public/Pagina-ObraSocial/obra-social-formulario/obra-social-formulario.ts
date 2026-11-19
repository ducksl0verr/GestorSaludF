import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { applyEach, form, FormField, maxLength, minLength, pattern, readonly, required } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NOMBRE_SIN_OBRA_SOCIAL, Obra_SocialNueva } from '../Model/Obra_Social';
import { ObraSocialService } from '../Service/obra-social-service';

@Component({
  imports: [CommonModule, RouterModule, FormField],
  selector: 'app-obra-social-formulario',
  styleUrl: './obra-social-formulario.css',
  templateUrl: './obra-social-formulario.html',
})
export class ObraSocialFormulario {
    obraId?: number;
    private route= inject(ActivatedRoute);
    
    protected base = this.route.snapshot.data['base'];
  
    obraModel= signal<Obra_SocialNueva>({
      nombre: '',
      cobertura:'',
      domicilios: [this.domicilioVacio()],
    });

    /** True cuando se está editando la obra social predeterminada "Sin obra social". */
    esPredeterminada = signal(false);

    obraForm = form(this.obraModel, (campo)=>{
      required(campo.nombre, { message: 'El nombre es obligatorio.'});
      minLength(campo.nombre, 3, { message: 'El nombre debe tener al menos 3 caracteres.'});
      
      required(campo.cobertura, { message: 'La cobertura es obligatoria.'});
      minLength(campo.cobertura, 3, { message: 'Por favor, ingrese una descripcipón mayor a 3 caracteres.'});

      readonly(campo.nombre, { when: () => this.esPredeterminada() });
      readonly(campo.cobertura, { when: () => this.esPredeterminada() });

      minLength(campo.domicilios, 1, { message: 'La obra social debe tener al menos un domicilio.'});
  
      applyEach(campo.domicilios, (domicilio)=>{
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

        readonly(domicilio.calle, { when: () => this.esPredeterminada() });
        readonly(domicilio.numero, { when: () => this.esPredeterminada() });
        readonly(domicilio.codigo_postal, { when: () => this.esPredeterminada() });
        readonly(domicilio.provincia, { when: () => this.esPredeterminada() });
        readonly(domicilio.localidad, { when: () => this.esPredeterminada() });
        readonly(domicilio.piso, { when: () => this.esPredeterminada() });
        readonly(domicilio.depto, { when: () => this.esPredeterminada() });
      })

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
      this.obraModel.update(obra => ({
        ...obra,
        domicilios: [...obra.domicilios, this.domicilioVacio()]
      }));
    }
  
    eliminarDomicilio(index: number): void {
      this.obraModel.update(obra => ({
        ...obra,
        domicilios: obra.domicilios.filter(
          (_, i) => i !== index
        )
      }));
    }
  
    constructor(
      private oService: ObraSocialService,
      private router: Router
    ){}
  
    ngOnInit(): void {
      const id = this.route.snapshot.params['id'];
  
      if(id){
        this.obraId = Number(id);
  
        this.oService.getObraSocial(this.obraId)
          .subscribe({
            next: (data)=>{
            this.esPredeterminada.set(this.esNombrePredeterminado(data.nombre));

            this.obraModel.set({
            nombre: data.nombre,
            cobertura: data.cobertura,
            domicilios: data.domicilios?.length
              ? data.domicilios.map(dom => ({ ...dom }))
              : [this.domicilioVacio()]
          });
        },
        error: (e)=>{
          this.error.set(e.error?.message || 'No se pudo cargar la obra social.')
        }});
      }
    }
    
    onSubmit(event: Event): void{
      event.preventDefault();

      if(this.esPredeterminada()){
        this.error.set('La obra social "Sin obra social" es predeterminada y no se puede modificar.');
        return;
      }

      if(this.obraForm().invalid()){
        this.obraForm().markAsTouched();
        return;
      }
  
      const obraData = this.obraModel();
      
  
      this.cargando.set(true);
      this.error.set('');
  
      if(this.obraId){
        this.oService.actualizarObraSocual(this.obraId, obraData).subscribe({
          next: ()=>{
            alert('Obra social actualizada correctamente.');
            this.router.navigate([this.base, 'obrasSociales']);
          },
          error: (e)=> {
            this.error.set(e.error?.message || 'No se pudo guardar a la obra social.');
            this.cargando.set(false);
          }
        });
      } else{
        this.oService.guardarObraSocial(obraData).subscribe({
          next: ()=>{
            alert('Obra Social actualizada correctamente.');
            this.router.navigate([this.base, 'obrasSociales']);
          },
          error: (e)=> {
            this.error.set(e.error?.message || 'No se pudo guardar la obra social.');
            this.cargando.set(false);
          }
        });
      }
    }

    /** Indica si el nombre corresponde a la obra social predeterminada. */
    private esNombrePredeterminado(nombre: string | null | undefined): boolean {
      return (nombre ?? '').trim().toLowerCase() === NOMBRE_SIN_OBRA_SOCIAL.toLowerCase();
    }

}
