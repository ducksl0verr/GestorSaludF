import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BotonSalir } from '../boton-salir/boton-salir';

@Component({

  imports: [RouterLink, BotonSalir],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {}
