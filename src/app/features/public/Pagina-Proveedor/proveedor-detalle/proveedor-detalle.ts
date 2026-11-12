import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProveedorService } from '../Service/proveedor-service';
import { Proveedor } from '../model/Proveedor';

@Component({
  imports: [RouterLink],
  selector: 'app-proveedor-detalle',
  styleUrl: './proveedor-detalle.css',
  templateUrl: './proveedor-detalle.html',
})
export class ProveedorDetalle {

  private pService = inject(ProveedorService);
  private route = inject(ActivatedRoute);
  private router= inject(Router);

  proveedor = signal<Proveedor | null>(null);
  cargando = signal(true);
  error = signal('');

  private base = this.route.snapshot.data['base'];

  constructor() {
      const id = Number(this.route.snapshot.paramMap.get('id'));
  
      this.pService.getProveedor(id).subscribe({
        next: (u) => {
          this.proveedor.set(u);
          this.cargando.set(false);
        },
        error: () => {
          this.error.set('No se encontró el proveedor.');
          this.cargando.set(false);
        },
      });
    }
  
    eliminar(p: Proveedor): void {
      if (!confirm(`¿Eliminar a ${p.nombre}?`)) return;
  
      this.pService.borrar(p.id).subscribe({
        next: () => this.router.navigate(['proveedores',this.base]),
        error: () => this.error.set('No se pudo eliminar el proveedor.'),
      });
    }

}
