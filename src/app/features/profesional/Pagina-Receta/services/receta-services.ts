import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { map } from 'rxjs';
import { Receta, RecetaNueva } from '../model/receta';

@Injectable({
    providedIn: 'root'
})

export class RecetaService {

    private http: HttpClient = inject(HttpClient);
    private readonly API_URL = "/api/recetas";
    private readonly CLAVE_OCULTAS = 'gestion-salud:recetas-ocultas';
    private platformId = inject(PLATFORM_ID);

    // Las recetas "eliminadas" solo se ocultan en el front; no se envía ningún DELETE.
    // Se guardan en localStorage para que sigan ocultas después de refrescar.
    private ocultas = new Set<number>(this.leerOcultas());

    private sinOcultas = map((recetas: Receta[]) =>
        recetas.filter(receta => !this.ocultas.has(receta.id))
    );

    ocultarReceta(id: number): void {
        this.ocultas.add(id);
        this.guardarOcultas();
    }

    private get storage(): Storage | null {
        return isPlatformBrowser(this.platformId) ? localStorage : null;
    }

    private leerOcultas(): number[] {
        try {
            const raw = this.storage?.getItem(this.CLAVE_OCULTAS);
            if (!raw) return [];

            const parsed: unknown = JSON.parse(raw);

            return Array.isArray(parsed)
                ? parsed.filter((id): id is number =>
                    typeof id === 'number' && Number.isFinite(id))
                : [];
        } catch {
            return [];
        }
    }

    private guardarOcultas(): void {
        try {
            this.storage?.setItem(this.CLAVE_OCULTAS, JSON.stringify([...this.ocultas]));
        } catch {
            // Si el almacenamiento no está disponible, se mantiene solo en memoria.
        }
    }

    getRecetas() {
        return this.http.get<Receta[]>(this.API_URL).pipe(this.sinOcultas);
    }

    getRecetasPorPaciente(idPaciente: number) {
        return this.http
            .get<Receta[]>(`${this.API_URL}/pacientes/${idPaciente}`)
            .pipe(this.sinOcultas);
    }

    getReceta(id: number) {
        return this.http.get<Receta>(`${this.API_URL}/${id}`);
    }

    guardarReceta(receta: RecetaNueva) {
        return this.http.post<Receta>(this.API_URL, receta);
    }

}
