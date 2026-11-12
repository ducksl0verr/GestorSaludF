import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Quirofano } from '../models/quirofano';
import { QuirofanoService } from '../services/quirofano-service';

@Component({
    selector: 'app-quirofano-lista',
    imports: [RouterLink],
    templateUrl: './quirofano-lista.html',
    styleUrl: './quirofano-lista.css'
})
export class QuirofanoLista implements OnInit {

    quirofanos = signal<Quirofano[]>([]);

    private route = inject(ActivatedRoute);
    protected base = this.route.snapshot.data['base'];  

    constructor(private quirofanoService: QuirofanoService) {}

    ngOnInit(): void {
        this.cargarQuirofanos();
    }

    cargarQuirofanos(): void {
        this.quirofanoService.getQuirofanos().subscribe({
            next: (datos) => {
                this.quirofanos.set(datos);
            },
            error: (error) => {
                console.error('Error al cargar los quirófanos', error);
            }
        });
    }

    ocuparQuirofano(id: number): void {
        this.quirofanoService.ocuparQuirofano(id).subscribe({
            next: () => {
                alert('Quirófano ocupado correctamente');
                this.cargarQuirofanos();
            },
            error: (error) => {
                console.error('Error al ocupar el quirófano', error);
            }
        });
    }
}