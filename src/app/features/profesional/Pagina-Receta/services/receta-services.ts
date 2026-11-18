import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service, ɵisInjectable } from '@angular/core';
import { map } from 'rxjs';
import { Receta, RecetaNueva } from '../model/receta';

@Injectable({
    providedIn: 'root'
})

export class RecetaService {

    private http: HttpClient = inject(HttpClient);
    private readonly API_URL = "/api/recetas";

    // Las recetas "eliminadas" solo se ocultan en el front; no se envía ningún DELETE.
    private ocultas = new Set<number>();

    private sinOcultas = map((recetas: Receta[]) =>
        recetas.filter(receta => !this.ocultas.has(receta.id))
    );

    ocultarReceta(id: number): void {
        this.ocultas.add(id);
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
