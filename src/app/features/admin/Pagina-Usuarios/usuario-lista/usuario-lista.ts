import { Component, inject, Input, signal } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { UsuarioService } from '../service/usuario-service';
import { CommonModule } from '@angular/common';
import { Usuario } from '../models/Usuario';
import { Profesional } from '../models/Profesional';

@Component({
  imports: [CommonModule, RouterModule],
  selector: 'app-usuario-lista',
  styleUrl: './usuario-lista.css',
  templateUrl: './usuario-lista.html',
})
export class UsuarioLista {

  esProfesional = false;
  usuarios = signal<(Usuario | Profesional)[]>([]);

  constructor(
    private UService: UsuarioService,
    private route: ActivatedRoute
  ){}

  ngOnInit(): void{
    this.esProfesional= this.route.snapshot.data['esProfesional'] ?? false;
    this.cargarUsuarios();
  }

  cargarUsuarios(): void{
    if(this.esProfesional){
      this.UService.getProfesionales().subscribe({
        next: (data) =>{
          console.log('Profesionales recibidos: ', data);
          this.usuarios.set(data);
        },
        error: (error)=>{
          console.error('Error al cargar profesionales: ', error);
        }
      });

    } else {
      this.UService.getUsuarios().subscribe({
        next: (data)=>{
          console.log('Usuarios recibidos: ',data);
          this.usuarios.set(data);
        },
      error: (error)=>{
          console.error('Error al cargar usuarios: ', error);
      }
    });
    }
  }

  borrarUsuario(id: number): void {
    this.UService.borrar(id).subscribe({
      next:()=>{
      this.cargarUsuarios();
      },
      error: (error)=>{
        console.error('Error al eliminar usuario: ', error);
      }
    });
  }
}
