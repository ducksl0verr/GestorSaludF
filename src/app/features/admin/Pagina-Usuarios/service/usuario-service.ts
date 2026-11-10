import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Usuario, UsuarioDTO } from '../models/Usuario';
import { CuentaNuevaPedido } from '../../../../core/models/CuentaNueva';
import { Profesional, ProfesionalDTO } from '../models/Profesional';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { Roles } from '../../../public/enums/Roles';


@Injectable({
    providedIn: 'root'
})
export class UsuarioService {

    private http:HttpClient = inject(HttpClient);
    private readonly API_URL = "/api/usuarios";

    //Usuarios
    getUsuarios(){
        return this.http.get<Usuario[]>(this.API_URL);
    }

    getUsuario(id: number){
        return this.http.get<Usuario>(`${this.API_URL}/${id}`);
    }

    guardarUsuario(usuario: CuentaNuevaPedido){
        return this.http.post<Usuario>(this.API_URL, usuario);
    }

    actualizarUsuario(id: number, usuario: UsuarioDTO){
        return this.http.put<Usuario>(
            `${this.API_URL}/${id}`,
            usuario
        );
    }

    //Profesionales
    getProfesionales(){
        return this.http.get<Profesional[]>(`${this.API_URL}/profesionales`);
    }

    getProfesional(id: number){
        return this.http.get<Profesional>(`${this.API_URL}/profesionales/${id}`);
    }

    guardarProfesional(profesional: CuentaNuevaPedido){
        return this.http.post<Profesional>(`${this.API_URL}/profesionales`,
            profesional
        );
    }

    actualizarProfesional(id: number, profesional: ProfesionalDTO){
        return this.http.put<Profesional>(
            `${this.API_URL}/profesionales/${id}`,
            profesional
        );
    }

    obtenerTodos(){
        return forkJoin({
            usuarios: this.getUsuarios(),
            profesionales: this.getProfesionales(),
        }).pipe(
            map(({ usuarios, profesionales })=>{
                const porId = new Map<number, Usuario | Profesional>();
                usuarios.forEach((u) => porId.set(u.id, u));
                profesionales.forEach((p)=> porId.set(p.id, p));
                return [...porId.values()];
            })
        )
    }

    obtener(id: number){
        return this.getUsuario(id).pipe(
            switchMap((u) =>
            u.role === Roles.ROLE_PROFESIONAL ? this.getProfesional(id) : of (u)),
        );
    }

    borrar(id: number){
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }

}
