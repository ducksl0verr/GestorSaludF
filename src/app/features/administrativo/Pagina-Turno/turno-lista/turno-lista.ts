import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Turno } from '../models/turno';
import { TurnoService } from '../services/turno-service';


@Component({
  imports: [CommonModule, RouterModule],
  selector: 'app-turno-lista',
  styleUrl: './turno-lista.css',
  templateUrl: './turno-lista.html',
})
export class TurnoLista implements OnInit {

turnos = signal<Turno[]>([]);
private route = inject(ActivatedRoute);
protected base = this.route.snapshot.data['base'];


constructor(private router : Router, private turnoService : TurnoService){}

ngOnInit(): void {
  this.cargarTurnos();
}

cargarTurnos(): void {
  this.turnoService.getTurnos().subscribe({
    next: (turnos) => {
      this.turnos.set(turnos);
    },
    error: (error) => {
      console.error('Error al obtener los turnos', error);
    }
  });
}

editarTurno(id: number): void {
  this.router.navigate([this.base, 'turnos', 'editar', id]);
}

}
