import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Usuario, UsuarioDTO } from '../models/Usuario';
import { CuentaNuevaPedido } from '../../../../core/models/CuentaNueva';
import { Profesional, ProfesionalDTO } from '../models/Profesional';


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

    borrar(id: number){
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }

}
