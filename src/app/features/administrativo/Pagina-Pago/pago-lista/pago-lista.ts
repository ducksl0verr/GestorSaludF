import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Pago } from '../models/pago';
import { PagoService } from '../services/pago-service';

@Component({
    selector: 'app-pago-lista',
    imports: [CommonModule, RouterLink],
    templateUrl: './pago-lista.html',
    styleUrl: './pago-lista.css'
})
export class PagoLista implements OnInit {

    pagos = signal<Pago[]>([]);

    fechaDesde = signal('');
    fechaHasta = signal('');

    rangoInvalido = computed(
        () => !!this.fechaDesde() && !!this.fechaHasta() && this.fechaDesde() > this.fechaHasta()
    );

    pagosFiltrados = computed(() => {
        const desde = this.fechaDesde();
        const hasta = this.fechaHasta();

        if (!desde && !hasta) {
            return this.pagos();
        }

        return this.pagos().filter(pago => {
            const dia = (pago.fecha ?? '').slice(0, 10);

            if (!dia) return false;
            if (desde && dia < desde) return false;
            if (hasta && dia > hasta) return false;

            return true;
        });
    });

    private route = inject(ActivatedRoute);
    private pagoService = inject(PagoService);

    protected base = this.route.snapshot.data['base'];

    ngOnInit(): void {
        this.cargarPagos();
    }

    limpiarFiltros(): void {
        this.fechaDesde.set('');
        this.fechaHasta.set('');
    }

    cargarPagos(): void {
        this.pagoService.getPagos().subscribe({
            next: (datos) => {
                this.pagos.set(datos);
            },
            error: (error) => {
                console.error('Error al cargar los pagos', error);
            }
        });
    }

    eliminar(pago: Pago): void {
        if (!confirm(`¿Eliminar el pago ${pago.id}?`)) return;

        this.pagoService.eliminarPago(pago.id).subscribe({
            next: () => this.cargarPagos(),
            error: (error) => {
                console.error('Error al eliminar el pago', error);
            }
        });
    }
}
