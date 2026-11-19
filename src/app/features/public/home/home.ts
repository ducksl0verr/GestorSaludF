import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface SlideInicio {
  imagen: string;
  alt: string;
  titulo: string;
  descripcion: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home implements OnInit, OnDestroy {

  // Para agregar más imágenes: copiá el archivo a public/images y agregá
  // un objeto a este arreglo con su título y descripción.
  slides: SlideInicio[] = [
    {
      imagen: 'images/logo 1.jpg',
      alt: 'Gestor de salud Oh, Doctor!',
      titulo: 'Todo lo necesario para tu salud, en un mismo lugar',
      descripcion: 'Un Gestor de Salud hospitalario de uso interno para poder facilitar y automatizar el trabajo de los profesionales y administrativos.'
    },
    {
      imagen: 'images/imagenParaNosotros.jpg',
      alt: 'Profesionales de la salud trabajando',
      titulo: 'Para ayudarte a ayudar',
      descripcion: 'Gestioná pacientes, turnos y medicamentos como un profesional de la salud.'
    },
    {
      imagen: 'images/logo 1.jpg',
      alt: 'Herramientas para el área administrativa',
      titulo: 'Menos papeleo, más salud',
      descripcion: 'Contactá proveedores, gestioná turnos, salas, pagos, profesionales y gastos como un administrativo.'
    },
    {
      imagen: 'images/imagenParaNosotros.jpg',
      alt: 'Gestión integral del hospital',
      titulo: 'La gestión total del hospital en un click',
      descripcion: 'Contactá proveedores, gestioná pagos, facturas, gastos, obras sociales y usuarios como el administrador.'
    }
  ];

  indice = signal(0);

  private readonly plataforma = inject(PLATFORM_ID);
  private temporizador?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.plataforma) || this.slides.length < 2) return;

    this.temporizador = setInterval(() => this.siguiente(), 6000);
  }

  ngOnDestroy(): void {
    if (this.temporizador) clearInterval(this.temporizador);
  }

  siguiente(): void {
    this.indice.update(i => (i + 1) % this.slides.length);
  }

  anterior(): void {
    this.indice.update(i => (i - 1 + this.slides.length) % this.slides.length);
  }

  irA(indice: number): void {
    this.indice.set(indice);
  }
}
