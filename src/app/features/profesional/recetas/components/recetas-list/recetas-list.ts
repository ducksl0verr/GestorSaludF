import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Receta } from '../../model/receta';
import { RecetaService } from '../../services/receta';

@Component({
  selector: 'app-recetas-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './recetas-list.html',
  styleUrl: './recetas-list.css'
})
export class RecetasList implements OnInit {

  recetas = signal<Receta[]>([]);

  constructor(
    private recetaService: RecetaService
  ) {}

  ngOnInit(): void {
    this.loadRecetas();
  }

  loadRecetas(): void {
    this.recetaService.getRecetas().subscribe({
      next: (data) => {
        console.log(data);
        this.recetas.set(data);
      },
      error: () => {
        alert('Error al cargar las recetas.');
      }
    });
  }
}
