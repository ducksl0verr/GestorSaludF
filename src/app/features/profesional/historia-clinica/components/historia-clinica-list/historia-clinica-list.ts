import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HistoriaClinica } from '../../model/historia-clinica';
import { HistoriaClinicaService } from '../../services/historia-clinica';

@Component({
  selector: 'app-historia-clinica-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './historia-clinica-list.html',
  styleUrl: './historia-clinica-list.css'
})
export class HistoriaClinicaList implements OnInit {

  historiasClinicas = signal<HistoriaClinica[]>([]);

  constructor(
    private historiaClinicaService: HistoriaClinicaService
  ) {}

  ngOnInit(): void {
    this.loadHistoriasClinicas();
  }

  loadHistoriasClinicas(): void {

    this.historiaClinicaService.getHistorias().subscribe({

      next: (data) => {
        console.log(data);
        this.historiasClinicas.set(data);
      },

      error: () => {
        alert('Error al cargar las historias clínicas.');
      }

    });

  }

}
