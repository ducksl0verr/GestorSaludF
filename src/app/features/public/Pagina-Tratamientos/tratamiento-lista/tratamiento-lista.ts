import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Tratamiento } from '../Model/Tratamiento';
import { TratamientoService } from '../Service/tratamiento-service';

@Component({
  imports: [RouterModule, CommonModule],
  selector: 'app-tratamiento-lista',
  styleUrl: './tratamiento-lista.css',
  templateUrl: './tratamiento-lista.html',
})
export class TratamientoLista {

  tratamientos = signal<Tratamiento[]>([]);
  
  private route = inject(ActivatedRoute);
  protected base = this.route.snapshot.data['base'];   //Esta cosa es para poder tener rutas dinamicas

  constructor(
      private tService: TratamientoService
    ){}
  
    ngOnInit(){
      this.cargarTratamientos();
    }
  
    cargarTratamientos(){
      this.tService.getTratamientos().subscribe( data => {
        console.log(data);
        this.tratamientos.set(data);
      })
    }
  
    borrarTratamiento(id: number){
      this.tService.borrarTratamiento(id).subscribe(()=>{
        this.cargarTratamientos();
      })
    }
}
