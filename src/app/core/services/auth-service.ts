import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RespuestaRegistro } from '../models/RespuestaRegistro';
import { RefreshTokenPedido } from '../models/RefreshTokenPedido';
import { AuthRespuesta } from '../models/AuthRespuesta';
import { AuthPedido } from '../models/AuthPedido';
import { CuentaNueva, CuentaNuevaPedido } from '../models/CuentaNueva';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private http = inject(HttpClient);
    private readonly API_URL="/api/auth";

    private readonly ACCESS_KEY = 'access_token';
    private readonly REFRESH_KEY = 'refresh_token';

    iniciarSesion(pedido: AuthPedido){
        return this.http.post<AuthRespuesta>(
        `${this.API_URL}/iniciar`,
        pedido
        )
        .pipe(tap(res=> this.guardarTokens(res)));
    }

    registrar(cuenta: CuentaNuevaPedido){
        console.log('Usuario que se envía: ', cuenta);

        return this.http.post<RespuestaRegistro>(
            `${this.API_URL}/registrar`,
        cuenta );
    }

    refrescarToken(): Observable<AuthRespuesta> {
        const cuerpo: RefreshTokenPedido = { refreshToken: this.getRefreshToken() ?? '' };
        return this.http
        .post<AuthRespuesta>(`${this.API_URL}/refresh`, cuerpo)
        .pipe(tap(res=> this.guardarTokens(res)));
    }

    cerrarSesion() {
        localStorage.removeItem(this.ACCESS_KEY);
        localStorage.removeItem(this.REFRESH_KEY);
    }

    getAccessToken(): string | null{
        return localStorage.getItem(this.ACCESS_KEY);
    }

    getRefreshToken(): string | null {
        return localStorage.getItem(this.REFRESH_KEY);
    }

    estaAutenticado() {
        return !!this.getAccessToken();
    }

    private guardarTokens (res: AuthRespuesta){
        localStorage.setItem(this.ACCESS_KEY, res.accessToken);
        localStorage.setItem(this.REFRESH_KEY, res.refreshToken);
    }

}
