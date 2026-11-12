import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
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

    private route = inject(ActivatedRoute);
    private facturaService = inject(FacturaService);

    protected base = this.route.snapshot.data['base'];

    ngOnInit(): void {
        this.cargarFacturas();
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
