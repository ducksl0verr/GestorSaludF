import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Proveedor } from '../model/Proveedor';
import { ProveedorService } from '../Service/proveedor-service';

@Component({
  imports: [RouterModule, CommonModule],
  selector: 'app-proveedor-lista',
  styleUrl: './proveedor-lista.css',
  templateUrl: './proveedor-lista.html',
})
export class ProveedorLista {

  proveedores = signal<Proveedor[]>([]);

  private route = inject(ActivatedRoute);
  protected base = this.route.snapshot.data['base'];   //Esta cosa es para poder tener rutas dinamicas

  
  constructor(
    private pService: ProveedorService
  ){}

  ngOnInit(){
    this.cargarProveedores();
  }

  cargarProveedores(){
    this.pService.getProveedores().subscribe( data => {
      console.log(data);
      this.proveedores.set(data);
    })
  }

  borrarProveedor(id: number){
    this.pService.borrar(id).subscribe(()=>{
      this.cargarProveedores();
    })
  }

}
