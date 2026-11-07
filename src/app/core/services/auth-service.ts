import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { RespuestaRegistro } from '../models/RespuestaRegistro';
import { Usuario } from '../models/usuario';
import { RefreshTokenPedido } from '../models/RefreshTokenPedido';
import { AuthRespuesta } from '../models/AuthRespuesta';
import { AuthPedido } from '../models/AuthPedido';

@Service()
export class AuthService {

    private http = inject(HttpClient);
    private API_URL="http://localhost:8080/api/auth";

    login(pedido: AuthPedido){
        return this.http.post<AuthRespuesta>(
        `${this.API_URL}/iniciar`,
        pedido
        );
    }

    registrar(usuario: Usuario){
        return this.http.post<RespuestaRegistro>(
            `${this.API_URL}/registrar`,
        {usuario}
    );
    }

    validarToken(){
        return this.http.get('http://localhost:8080/api/protegido')
    }

    refreshToken(pedido: RefreshTokenPedido){
        return this.http.post<AuthRespuesta>(`${this.API_URL}/refresh`,
                pedido
        );
    }

}
