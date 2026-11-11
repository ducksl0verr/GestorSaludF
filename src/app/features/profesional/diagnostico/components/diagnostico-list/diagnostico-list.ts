import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Diagnostico } from '../../model/diagnostico';
import { DiagnosticoService } from '../../services/diagnostico';

@Component({
    selector: 'app-diagnostico-list',
    imports: [CommonModule, RouterModule],
    templateUrl: './diagnostico-list.html',
    styleUrl: './diagnostico-list.css'
})

export class DiagnosticoList implements OnInit {

    diagnosticos = signal<Diagnostico[]>([]);

    constructor(
        private diagnosticoService: DiagnosticoService
    ) {}

    ngOnInit(): void {
        this.loadDiagnosticos();
    }

    loadDiagnosticos(): void {

        this.diagnosticoService.getDiagnosticos().subscribe({

            next: (data) => {
                console.log(data);
                this.diagnosticos.set(data);
            },

            error: () => {
                alert('Error al cargar los diagnósticos.');
            }

        });

    }

}
