import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Factura } from '../models/factura';
import { FacturaService } from '../services/factura-service';

@Component({
    selector: 'app-factura-detalles',
    imports: [CommonModule, RouterLink],
    templateUrl: './factura-detalles.html',
    styleUrl: './factura-detalles.css'
})
export class FacturaDetalles implements OnInit {

    factura = signal<Factura | null>(null);

    private route = inject(ActivatedRoute);
    private base = this.route.snapshot.data['base'];
    private facturaService = inject(FacturaService);

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.cargarFactura(id);
    }

    cargarFactura(id: number): void {
        this.facturaService.getFactura(id).subscribe({
            next: (datos) => {
                this.factura.set(datos);
            },
            error: (error) => {
                console.error('Error al cargar la factura', error);
            }
        });
    }
}
