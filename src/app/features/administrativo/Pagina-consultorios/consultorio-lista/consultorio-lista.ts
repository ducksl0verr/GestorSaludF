import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Consultorio } from '../models/consultorio';
import { ConsultorioService } from '../services/consultorio-service';

@Component({
    selector: 'app-consultorio-lista',
    imports: [RouterLink],
    templateUrl: './consultorio-lista.html',
    styleUrl: './consultorio-lista.css'
})
export class ConsultorioLista implements OnInit {

    consultorios = signal<Consultorio[]>([]);
    private route = inject(ActivatedRoute);
    protected base = this.route.snapshot.data['base'];


    constructor(private consultorioService: ConsultorioService) {}

    ngOnInit(): void {
        this.cargarConsultorios();
    }



    cargarConsultorios(): void {
        this.consultorioService.getConsultorios().subscribe({
            next: (datos) => {
                this.consultorios.set(datos);
            },
            error: (error) => {
                console.error('Error al cargar los consultorios', error);
            }
        });
    }




    
}