import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Pago } from '../models/pago';
import { PagoService } from '../services/pago-service';

@Component({
    selector: 'app-pago-detalles',
    imports: [CommonModule, RouterLink],
    templateUrl: './pago-detalles.html',
    styleUrl: './pago-detalles.css'
})
export class PagoDetalles implements OnInit {

    pago = signal<Pago | null>(null);

    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private base = this.route.snapshot.data['base'];
    private pagoService = inject(PagoService);

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.cargarPago(id);
    }

    cargarPago(id: number): void {
        this.pagoService.getPago(id).subscribe({
            next: (datos) => {
                this.pago.set(datos);
            },
            error: (error) => {
                console.error('Error al cargar el pago', error);
            }
        });
    }

    eliminar(): void {
        const pago = this.pago();

        if (!pago) return;
        if (!confirm(`¿Eliminar el pago ${pago.id}?`)) return;

        this.pagoService.eliminarPago(pago.id).subscribe({
            next: () => this.router.navigate([this.base, 'pagos']),
            error: (error) => {
                console.error('Error al eliminar el pago', error);
            }
        });
    }
}
