import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Quirofano } from '../models/quirofano';
import { QuirofanoNuevo } from '../models/quirofano-nuevo';
import { QuirofanoActualizar } from '../models/quirofano-actualizar';

@Injectable({
    providedIn: 'root'
})
export class QuirofanoService {

    private http: HttpClient = inject(HttpClient);
    private readonly API_URL = '/api/quirofanos';

    getQuirofanos() {
        return this.http.get<Quirofano[]>(this.API_URL);
    }

    getQuirofano(id: number) {
        return this.http.get<Quirofano>(`${this.API_URL}/${id}`);
    }

    guardarQuirofano(quirofano: QuirofanoNuevo) {
        return this.http.post<Quirofano>(this.API_URL, quirofano);
    }

    actualizarQuirofano(id: number, quirofano: QuirofanoActualizar) {
        return this.http.put<Quirofano>(`${this.API_URL}/${id}`,quirofano);
    }

    ocuparQuirofano(id: number) {
        return this.http.put<Quirofano>(`${this.API_URL}/${id}/ocupar`,null);
    }
}