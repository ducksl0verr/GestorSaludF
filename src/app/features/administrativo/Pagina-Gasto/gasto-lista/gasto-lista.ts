import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
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

    fechaDesde = signal('');
    fechaHasta = signal('');

    rangoInvalido = computed(
        () => !!this.fechaDesde() && !!this.fechaHasta() && this.fechaDesde() > this.fechaHasta()
    );

    gastosFiltrados = computed(() => {
        const desde = this.fechaDesde();
        const hasta = this.fechaHasta();

        if (!desde && !hasta) {
            return this.gastos();
        }

        return this.gastos().filter(gasto => {
            const dia = (gasto.fecha ?? '').slice(0, 10);

            if (!dia) return false;
            if (desde && dia < desde) return false;
            if (hasta && dia > hasta) return false;

            return true;
        });
    });

    private route = inject(ActivatedRoute);
    private gastoService = inject(GastoService);

    protected base = this.route.snapshot.data['base'];

    ngOnInit(): void {
        this.cargarGastos();
    }

    limpiarFiltros(): void {
        this.fechaDesde.set('');
        this.fechaHasta.set('');
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
