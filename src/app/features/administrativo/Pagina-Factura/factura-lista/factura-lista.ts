import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Factura } from '../models/factura';
import { FacturaService } from '../services/factura-service';

@Component({
    selector: 'app-factura-lista',
    imports: [CommonModule, RouterLink],
    templateUrl: './factura-lista.html',
    styleUrl: './factura-lista.css'
})
export class FacturaLista implements OnInit {

    facturas = signal<Factura[]>([]);

    fechaDesde = signal('');
    fechaHasta = signal('');

    rangoInvalido = computed(
        () => !!this.fechaDesde() && !!this.fechaHasta() && this.fechaDesde() > this.fechaHasta()
    );

    facturasFiltradas = computed(() => {
        const desde = this.fechaDesde();
        const hasta = this.fechaHasta();

        if (!desde && !hasta) {
            return this.facturas();
        }

        return this.facturas().filter(factura => {
            const dia = (factura.fechaEmision ?? '').slice(0, 10);

            if (!dia) return false;
            if (desde && dia < desde) return false;
            if (hasta && dia > hasta) return false;

            return true;
        });
    });

    private route = inject(ActivatedRoute);
    private facturaService = inject(FacturaService);

    protected base = this.route.snapshot.data['base'];

    ngOnInit(): void {
        this.cargarFacturas();
    }

    limpiarFiltros(): void {
        this.fechaDesde.set('');
        this.fechaHasta.set('');
    }

    cargarFacturas(): void {
        this.facturaService.getFacturas().subscribe({
            next: (datos) => {
                this.facturas.set(datos);
            },
            error: (error) => {
                console.error('Error al cargar las facturas', error);
            }
        });
    }
}
