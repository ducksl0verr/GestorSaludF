import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { BotonSalir } from '../../features/public/boton-salir/boton-salir';

@Component({
  imports: [RouterLink, RouterOutlet, BotonSalir],
  selector: 'app-prof-layouts',
  styleUrl: './prof-layouts.css',
  templateUrl: './prof-layouts.html',
})
export class ProfLayouts {}
