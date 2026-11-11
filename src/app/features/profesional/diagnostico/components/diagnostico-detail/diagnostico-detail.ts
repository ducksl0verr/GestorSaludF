
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Diagnostico } from '../../model/diagnostico';
import { DiagnosticoService } from '../../services/diagnostico';


@Component({
  selector: 'app-diagnostico-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './diagnostico-detail.html',
  styleUrl: './diagnostico-detail.css'
})
export class DiagnosticoDetail implements OnInit {

  diagnostico = signal<Diagnostico | undefined>(undefined);

  constructor(
    private diagnosticoService: DiagnosticoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {

      this.diagnosticoService.getDiagnostico(id).subscribe({

        next: (data) => {
          this.diagnostico.set(data);
        },

        error: () => {
          alert('Error al obtener el diagnóstico.');
        }

      });

    }

  }

  eliminarDiagnostico(id: string | undefined): void {

    if (!id) {
      alert('No se encontró el ID del diagnóstico.');
      return;
    }

    if (confirm('¿Desea eliminar este diagnóstico?')) {

      this.diagnosticoService.deleteDiagnostico(id).subscribe({

        next: () => {
          alert('Diagnóstico eliminado correctamente.');
          this.router.navigate(['/diagnosticos']);
        },

        error: () => {
          alert('Error al eliminar el diagnóstico.');
        }

      });

    }

  }

}















