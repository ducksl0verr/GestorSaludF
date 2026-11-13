import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BotonSalir } from '../../features/public/boton-salir/boton-salir';

@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet, BotonSalir],
  selector: 'app-administrativo-layout',
  styleUrl: './administrativo-layout.css',
  templateUrl: './administrativo-layout.html',
})
export class AdministrativoLayout {}
