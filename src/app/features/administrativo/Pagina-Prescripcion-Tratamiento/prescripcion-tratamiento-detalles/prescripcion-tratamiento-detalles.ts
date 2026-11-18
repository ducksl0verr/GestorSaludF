import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PrescripcionTratamiento } from '../models/prescripcion-tratamiento';
import { PrescripcionTratamientoService } from '../services/prescripcion-tratamiento-service';

@Component({
  imports: [RouterLink],
  selector: 'app-prescripcion-tratamiento-detalles',
  styleUrl: './prescripcion-tratamiento-detalles.css',
  templateUrl: './prescripcion-tratamiento-detalles.html',
})
export class PrescripcionTratamientoDetalles implements OnInit{

  prescripcionTratamiento = signal<PrescripcionTratamiento | undefined>(undefined);

  constructor(private router: Router, private prescripcionTratamientoService: PrescripcionTratamientoService, private route : ActivatedRoute) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.prescripcionTratamientoService.getPrescripcionTratamiento(id).subscribe({
        next: (prescripcionTratamiento) => {
            this.prescripcionTratamiento.set(prescripcionTratamiento);
        },
        error: (error) => console.error('Error al obtener la prescripción de tratamiento', error)
    });
  }


  eliminar(p : PrescripcionTratamiento): void {
      if (!confirm(`¿Eliminar la prescripción de tratamiento ${p.id}?`)) return;
  
      this.prescripcionTratamientoService.darBajaPrescripcionTratamiento(p.id).subscribe({
        next: () => this.router.navigate(['/administrativo', 'prescripciones']),
        error: () => console.error('No se pudo eliminar la prescripción de tratamiento.'),
      });
    }


}
