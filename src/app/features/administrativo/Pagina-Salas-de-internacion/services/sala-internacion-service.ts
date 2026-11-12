import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { SalaInternacion } from '../models/sala-internacion';
import { SalaInternacionNueva } from '../models/sala-internacion-nueva';
import { SalaInternacionActualizar } from '../models/sala-internacion-actualizar';

@Injectable({
    providedIn: 'root'
})
export class SalaInternacionService {

    private http: HttpClient = inject(HttpClient);
    private readonly API_URL = '/api/salasInternaciones';

    // Obtener todas las salas
    getSalasInternacion() {
        return this.http.get<SalaInternacion[]>(this.API_URL);
    }

    // Obtener una sala por ID
    getSalaInternacion(id: number) {
        return this.http.get<SalaInternacion>(`${this.API_URL}/${id}`);
    }

    // Registrar una sala
    guardarSalaInternacion(sala: SalaInternacionNueva) {
        return this.http.post<SalaInternacion>(this.API_URL, sala);
    }

    // Actualizar la capacidad de una sala
    actualizarSalaInternacion(id: number, sala: SalaInternacionActualizar) {
        return this.http.put<SalaInternacion>(`${this.API_URL}/${id}`,sala);
    }

    // Internar un paciente en una sala
    internarPaciente(idSala: number, idPaciente: number) {
        return this.http.put<SalaInternacion>(`${this.API_URL}/${idSala}/internar/${idPaciente}`,{});
    }
}