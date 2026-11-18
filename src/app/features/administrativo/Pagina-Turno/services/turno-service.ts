import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Turno } from "../models/turno";
import { TurnoNuevo } from "../models/turno-nuevo";
import { TurnoActualizar } from "../models/turno-actualizar";
import { TurnoFacturable } from "../models/turno-facturable";

@Injectable({
    providedIn: 'root'
})
export class TurnoService {

    private http: HttpClient = inject(HttpClient);
    private readonly API_URL = '/api/turnos';

    getTurnos() {
        return this.http.get<Turno[]>(this.API_URL);
    }

    getTurno(id: number) {
        return this.http.get<Turno>(`${this.API_URL}/${id}`);
    }

    actualizarTurno(id: number, turno: TurnoActualizar) {
        return this.http.put<Turno>(`${this.API_URL}/${id}`, turno);
    }

    registrarTurno(turno: TurnoNuevo) {
        return this.http.post<Turno>(this.API_URL, turno);
    }

    eliminarTurno(id: number) {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
}

    getTurnosFacturables(idPaciente: number) {
        return this.http.get<TurnoFacturable[]>(
            `${this.API_URL}/pacientes/${idPaciente}/turnos-facturables`
        );
    }

}