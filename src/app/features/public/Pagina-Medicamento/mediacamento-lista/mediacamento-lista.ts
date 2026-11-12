import { Component, inject, signal } from '@angular/core';
import { Medicamento, MedicamentoNuevo } from '../Model/Medicamento';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-mediacamento-lista',
  styleUrl: './mediacamento-lista.css',
  templateUrl: './mediacamento-lista.html',
})
export class MediacamentoLista {

  medicamentos = signal<Medicamento[]>([]);
  private router = inject(Router);

  

}
