import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Gasto } from '../models/gasto';
import { GastoService } from '../services/gasto-service';

@Component({
    selector: 'app-gasto-lista',
    imports: [CommonModule, RouterLink],
    templateUrl: './gasto-lista.html',
    styleUrl: './gasto-lista.css'
})
export class GastoLista implements OnInit {

    gastos = signal<Gasto[]>([]);

    private route = inject(ActivatedRoute);
    private gastoService = inject(GastoService);

    protected base = this.route.snapshot.data['base'];

    ngOnInit(): void {
        this.cargarGastos();
    }

    cargarGastos(): void {
        this.gastoService.getGastos().subscribe({
            next: (datos) => {
                this.gastos.set(datos);
            },
            error: (error) => {
                console.error('Error al cargar los gastos', error);
            }
        });
    }

    eliminar(gasto: Gasto): void {
        if (!confirm(`¿Eliminar el gasto ${gasto.id}?`)) return;

        this.gastoService.eliminarGasto(gasto.id).subscribe({
            next: () => this.cargarGastos(),
            error: (error) => {
                console.error('Error al eliminar el gasto', error);
            }
        });
    }
}
