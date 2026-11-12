import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

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




    eliminarConsultorio(id: number): void {
      if (confirm('¿Estás seguro de que deseas eliminar este consultorio?')) {
          this.consultorioService.eliminarConsultorio(id).subscribe({
              next: () => {
                  alert('Consultorio eliminado correctamente');
                  this.cargarConsultorios();
                },
                error: (error) => {
                    console.error('Error al eliminar el consultorio', error);
                }
          });
      }
  }
}