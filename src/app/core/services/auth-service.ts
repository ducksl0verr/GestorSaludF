import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { RespuestaRegistro } from '../models/RespuestaRegistro';
import { RefreshTokenPedido } from '../models/RefreshTokenPedido';
import { AuthRespuesta } from '../models/AuthRespuesta';
import { AuthPedido } from '../models/AuthPedido';
import { CuentaNueva, CuentaNuevaPedido } from '../models/CuentaNueva';
import { Observable, tap } from 'rxjs';
import { Roles } from '../../features/public/enums/Roles';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private http = inject(HttpClient);
    private readonly API_URL="/api/auth";

    private readonly ACCESS_KEY = 'access_token';
    private readonly REFRESH_KEY = 'refresh_token';

    
    private readonly RUTA_INICIO: Record<Roles, string> = {
        [Roles.ROLE_ADMINISTRADOR]: '/admin',
        [Roles.ROLE_ADMINISTRATIVO]: '/administrativo',
        [Roles.ROLE_PROFESIONAL]: '/profesional',
    };

    private platformId= inject(PLATFORM_ID);

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
        this.storage?.removeItem(this.ACCESS_KEY);
        this.storage?.removeItem(this.REFRESH_KEY);
    }

    getAccessToken(): string | null{
        return this.storage?.getItem(this.ACCESS_KEY) ?? null;
    }

    getRefreshToken(): string | null {
        return this.storage?.getItem(this.REFRESH_KEY) ?? null;
    }

    estaAutenticado() {
        return !!this.getAccessToken();
    }

    private getPayload(): Record<string, unknown> | null {
        const token = this.getAccessToken();
        if (!token) return null;
        try {
            const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
            const json = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
                .join(''),
            );
            return JSON.parse(json);
        } catch {
            return null;
        }
    }

    getRol(): Roles | null {
        const raw = this.getPayload()?.['role'];

        return (Object.values(Roles) as string[]).includes(raw as string) ? (raw as Roles) : null;
    }

    getPermisos(): string []{
        const p = this.getPayload()?.['permisos'];
        return Array.isArray(p)?(p as string[]):[];
    }

    tienePermiso(permiso: string) {
        return this.getPermisos().includes(permiso);
    }
    
    rutaInicio() {
        const rol = this.getRol();
        return rol ? this.RUTA_INICIO[rol] : '/login';
    }

    private get storage(): Storage | null {
        return isPlatformBrowser(this.platformId) ? localStorage: null;
    }

    private guardarTokens (res: AuthRespuesta){
        this.storage?.setItem(this.ACCESS_KEY, res.accessToken);
        this.storage?.setItem(this.REFRESH_KEY, res.refreshToken);
    }
}
