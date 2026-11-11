import { Component, inject, signal } from '@angular/core';
import { ObraSocialService } from '../Service/obra-social-service';
import { Obra_Social } from '../Model/Obra_Social';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  imports: [RouterModule, CommonModule],
  selector: 'app-obra-social-lista',
  styleUrl: './obra-social-lista.css',
  templateUrl: './obra-social-lista.html',
})

export class ObraSocialLista {
  obras = signal<Obra_Social[]>([]);
  private router = inject(Router);

  get rutaObras(): string {
    return this.router.url.startsWith('/admin/')
      ? '/admin/obrasSociales'
      : '/administrativo/obrasSociales';
  }

  
  constructor(
    private oService: ObraSocialService
  ){}

  ngOnInit(){
    this.cargarObras();
  }

  cargarObras(){
    this.oService.getObrasSociales().subscribe( data => {
      console.log(data);
      this.obras.set(data);
    })
  }

  borrarObra(id: number){
    this.oService.borrarObraSocial(id).subscribe(()=>{
      this.cargarObras();
    })
  }

}
