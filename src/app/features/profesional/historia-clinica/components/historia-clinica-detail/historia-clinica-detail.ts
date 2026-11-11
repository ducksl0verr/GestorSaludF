import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { HistoriaClinica } from '../../model/historia-clinica';
import { HistoriaClinicaService } from '../../services/historia-clinica';

@Component({
    selector: 'app-historia-clinica-detail',
    imports: [CommonModule, RouterModule],
    templateUrl: './historia-clinica-detail.html',
    styleUrl: './historia-clinica-detail.css'
})

export class HistoriaClinicaDetail implements OnInit {

    historiaClinica = signal<HistoriaClinica | undefined>(undefined);

    constructor(
        private historiaClinicaService: HistoriaClinicaService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {

        const id = this.route.snapshot.paramMap.get('id');

        if (id) {

            this.historiaClinicaService.getHistoria(id).subscribe({

                next: (data) => {
                    this.historiaClinica.set(data);
                },

                error: () => {
                    alert('Error al obtener la historia clínica.');
                }

            });

        }

    }

    eliminarHistoriaClinica(id: string | undefined): void {

        if (!id) {
            alert('No se encontró el ID de la historia clínica.');
            return;
        }

        if (confirm('¿Desea eliminar esta historia clínica?')) {

            this.historiaClinicaService.deleteHistoria(id).subscribe({

                next: () => {

                    alert('Historia clínica eliminada correctamente.');

                    this.router.navigate(['/admin/historia-clinica']);

                },

                error: () => {
                    alert('Error al eliminar la historia clínica.');
                }

            });

        }

    }

}
