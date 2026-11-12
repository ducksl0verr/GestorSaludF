import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service, ɵisInjectable } from '@angular/core';
import { Receta, RecetaNueva } from '../model/receta';

@Injectable({
    providedIn: 'root'
})

export class RecetaService {

    private http: HttpClient = inject(HttpClient);
    private readonly API_URL = "/api/recetas";

    getRecetas() {
        return this.http.get<Receta[]>(this.API_URL);
    }

    getReceta(id: number) {
        return this.http.get<Receta>(`${this.API_URL}/${id}`);
    }

    guardarReceta(receta: RecetaNueva) {
        return this.http.post<Receta>(this.API_URL, receta);
    }

    borrar(id: number) {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }

}
