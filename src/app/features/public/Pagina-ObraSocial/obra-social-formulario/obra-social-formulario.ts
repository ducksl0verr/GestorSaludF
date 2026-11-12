import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { applyEach, form, FormField, maxLength, minLength, pattern, required } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Obra_SocialNueva } from '../Model/Obra_Social';
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
    
    private base = this.route.snapshot.data['base'];
  
    obraModel= signal<Obra_SocialNueva>({
      nombre: '',
      cobertura:'',
      domicilios: [],
    });
  
    obraForm = form(this.obraModel, (campo)=>{
      required(campo.nombre, { message: 'El nombre es obligatorio.'});
      minLength(campo.nombre, 3, { message: 'El nombre debe tener al menos 3 caracteres.'});
      
      required(campo.cobertura, { message: 'La cobertura es obligatoria.'});
      minLength(campo.cobertura, 3, { message: 'Por favor, ingrese una descripcipón mayor a 3 caracteres.'});

      minLength(campo.domicilios, 1, { message: 'La obra social debe tener al menos un domicilio.'});
  
      applyEach(campo.domicilios, (domicilio)=>{
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

    });
  
    cargando = signal(false);
    error = signal('');
  
    agregarDomicilio() {
      this.obraModel.update(obra => ({
        ...obra,
        domicilios: [
          ...obra.domicilios,
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
            this.obraModel.set({
            nombre: data.nombre,
            cobertura: data.cobertura,
            domicilios: data.domicilios.map(dom=>({
              ...dom
            }))
          });
        },
        error: (e)=>{
          this.error.set(e.error?.message || 'No se pudo cargar la obra social.')
        }});
      }
    }
    
    onSubmit(event: Event): void{
      event.preventDefault();
  
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
            this.router.navigate([this.base]);
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
            this.router.navigate([this.base]);
          },
          error: (e)=> {
            this.error.set(e.error?.message || 'No se pudo guardar la obra social.');
            this.cargando.set(false);
          }
        });
      }
    }

}
