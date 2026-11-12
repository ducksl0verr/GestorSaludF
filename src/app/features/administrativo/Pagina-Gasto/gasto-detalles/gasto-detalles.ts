import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Gasto } from '../models/gasto';
import { GastoService } from '../services/gasto-service';

@Component({
    selector: 'app-gasto-detalles',
    imports: [CommonModule, RouterLink],
    templateUrl: './gasto-detalles.html',
    styleUrl: './gasto-detalles.css'
})
export class GastoDetalles implements OnInit {

    gasto = signal<Gasto | null>(null);

    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private base = this.route.snapshot.data['base'];
    private gastoService = inject(GastoService);

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.cargarGasto(id);
    }

    cargarGasto(id: number): void {
        this.gastoService.getGasto(id).subscribe({
            next: (datos) => {
                this.gasto.set(datos);
            },
            error: (error) => {
                console.error('Error al cargar el gasto', error);
            }
        });
    }

    eliminar(): void {
        const gasto = this.gasto();

        if (!gasto) return;
        if (!confirm(`¿Eliminar el gasto ${gasto.id}?`)) return;

        this.gastoService.eliminarGasto(gasto.id).subscribe({
            next: () => this.router.navigate([this.base, 'gastos']),
            error: (error) => {
                console.error('Error al eliminar el gasto', error);
            }
        });
    }
}
