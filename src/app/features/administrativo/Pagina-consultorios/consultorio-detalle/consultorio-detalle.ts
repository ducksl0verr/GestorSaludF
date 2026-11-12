import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Consultorio } from '../models/consultorio';
import { ConsultorioService } from '../services/consultorio-service';

@Component({
    selector: 'app-consultorio-detalle',
    imports: [RouterLink],
    templateUrl: './consultorio-detalle.html',
    styleUrl: './consultorio-detalle.css'
})
export class ConsultorioDetalle implements OnInit {

    consultorio = signal<Consultorio | null>(null);

    constructor(
        private route: ActivatedRoute,
        private consultorioService: ConsultorioService
    ) {}

    

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.cargarConsultorio(id);
    }


    cargarConsultorio(id: number): void {
        this.consultorioService.getConsultorio(id).subscribe({
            next: (datos) => {
                this.consultorio.set(datos);
            },
            error: (error) => {
                console.error('Error al cargar el consultorio', error);
            }
        });
    }
}