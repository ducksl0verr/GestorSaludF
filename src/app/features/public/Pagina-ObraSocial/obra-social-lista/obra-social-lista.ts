import { Component, computed, inject, signal } from '@angular/core';
import { ObraSocialService } from '../Service/obra-social-service';
import { NOMBRE_SIN_OBRA_SOCIAL, Obra_Social } from '../Model/Obra_Social';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  imports: [RouterModule, CommonModule],
  selector: 'app-obra-social-lista',
  styleUrl: './obra-social-lista.css',
  templateUrl: './obra-social-lista.html',
})

export class ObraSocialLista {
  obras = signal<Obra_Social[]>([]);
  busqueda = signal('');

  obrasFiltradas = computed(() => {
    const termino = this.busqueda().trim().toLowerCase();

    if (!termino) {
      return this.obras();
    }

    return this.obras().filter(o =>
      o.nombre.toLowerCase().includes(termino)
    );
  });

  private route = inject(ActivatedRoute);
  protected base = this.route.snapshot.data['base'];   //Esta cosa es para poder tener rutas dinamicas
  protected esAdmin = this.base === '/admin';

  private platformId = inject(PLATFORM_ID);
  
  constructor(
    private oService: ObraSocialService
  ){}

  ngOnInit(){
    if (!isPlatformBrowser(this.platformId)) {
        return;
    }
    this.cargarObras();
  }

  cargarObras(){
    this.oService.getObrasSociales().subscribe( data => {
      console.log(data);
      this.obras.set(data);
    })
  }


  protected mensajeError = signal<string | null> (null);

  /** La obra social "Sin obra social" es predeterminada y no se edita ni elimina. */
  esPredeterminada(obra: Obra_Social): boolean {
    return (obra.nombre ?? '').trim().toLowerCase() === NOMBRE_SIN_OBRA_SOCIAL.toLowerCase();
  }

  borrarObra(id: number){
    this.mensajeError.set(null);
    this.oService.borrarObraSocial(id).subscribe({
      next: ()=>{
      this.cargarObras();
      },
      error: (e)=>{
        console.error('Error al eliminar la obra social: ', e);
        this.mensajeError.set(
          e.error?.mensaje ?? e.error?.message ?? 'No se pudo eliminar la obra social.'
        );
      }
    })
  }

}
