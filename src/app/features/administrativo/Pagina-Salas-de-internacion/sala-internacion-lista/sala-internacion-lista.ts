import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { SalaInternacion } from '../models/sala-internacion';
import { SalaInternacionService } from '../services/sala-internacion-service';

@Component({
    selector: 'app-sala-internacion-lista',
    imports: [RouterLink],
    templateUrl: './sala-internacion-lista.html',
    styleUrl: './sala-internacion-lista.css'
})
export class SalaInternacionLista implements OnInit {

    salas = signal<SalaInternacion[]>([]);
     private route = inject(ActivatedRoute);
    protected base = this.route.snapshot.data['base'];   //Esta cosa es para poder tener rutas dinamicas


    constructor(private salaService: SalaInternacionService) {}

    ngOnInit(): void {
        this.cargarSalas();
    }

    cargarSalas(): void {
        this.salaService.getSalasInternacion().subscribe({
            next: (datos) => {
                this.salas.set(datos);
            },
            error: (error) => {
                console.error('Error al cargar las salas de internación', error);
            }
        });
    }
}