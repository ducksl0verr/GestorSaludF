import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
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

    private route = inject(ActivatedRoute);
    private pagoService = inject(PagoService);

    protected base = this.route.snapshot.data['base'];

    ngOnInit(): void {
        this.cargarPagos();
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
