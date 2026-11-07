import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { RepuestaLogin } from '../models/RepuestaLogin';
import { RepsuestaRegistro } from '../models/RepuestaRegistro';
import { Usuario } from '../models/usuario';

@Service()
export class AuthService {

    private http = inject(HttpClient);
    private API_URL="http://localhost:8080/api/auth";

    login(username:string, password: string){
        return this.http.post<RepuestaLogin>(
        `${this.API_URL}/iniciar`,
        {username, password}
        );
    }

    registrar(usuario: Usuario){
        return this.http.post<RepsuestaRegistro>(
            `${this.API_URL}/registrar`,
        {usuario}
    );
    }

    validarToken(){
        return this.http.get('http://localhost:8080/api/protegido')
    }

    refreshToken(refreshToken: string){
        return this.http.post(`${this.API_URL}/refresh`,{
            r
        })
    }

}
