import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Turno } from "../models/turno";

@Injectable({
    providedIn: 'root'
})
export class TurnoService {

    private http : HttpClient = inject(HttpClient);
    private readonly API_URL = '/api/turnos';


    getTurnos() {
        return this.http.get<Turno[]>(this.API_URL);
    }

    getTurno(id: number) {
        return this.http.get<Turno>(`${this.API_URL}/${id}`);
    }

    actualizarTurno(id: number, turno: Turno) {
        return this.http.put<Turno>(`${this.API_URL}/${id}`, turno);
    }

    registrarTurno(turno: Turno) {
        return this.http.post<Turno>(this.API_URL, turno);
    }

    borrarTurno(id: number) {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }

    
}
