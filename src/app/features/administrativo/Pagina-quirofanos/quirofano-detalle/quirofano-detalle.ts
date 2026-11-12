import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Quirofano } from '../models/quirofano';
import { QuirofanoService } from '../services/quirofano-service';

@Component({
    selector: 'app-quirofano-detalle',
    imports: [RouterLink],
    templateUrl: './quirofano-detalle.html',
    styleUrl: './quirofano-detalle.css'
})
export class QuirofanoDetalle implements OnInit {

    quirofano = signal<Quirofano | null>(null);
    private route = inject(ActivatedRoute);
    protected base = this.route.snapshot.data['base'];  

    constructor(
        private quirofanoService: QuirofanoService
    ) {}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.cargarQuirofano(id);
    }

    cargarQuirofano(id: number): void {
        this.quirofanoService.getQuirofano(id).subscribe({
            next: (datos) => {
                this.quirofano.set(datos);
            },
            error: (error) => {
                console.error('Error al cargar el quirófano', error);
            }
        });
    }
}