import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Diagnostico, DiagnosticoNuevo } from '../model/diagnostico';



@Injectable({
    providedIn: 'root'
})
export class DiagnosticoService {

    private http: HttpClient = inject(HttpClient);
    private readonly API_URL = "/api/diagnosticos";

    getDiagnosticos() {
        return this.http.get<Diagnostico[]>(this.API_URL);
    }

    getDiagnostico(id: number) {
        return this.http.get<Diagnostico>(`${this.API_URL}/${id}`);
    }

    guardarDiagnostico(diagnostico: DiagnosticoNuevo) {
        return this.http.post<Diagnostico>(this.API_URL, diagnostico);
    }

    actualizarDiagnostico(id: number, diagnostico: DiagnosticoNuevo) {
        return this.http.put<Diagnostico>(`${this.API_URL}/${id}`, diagnostico);
    }

    borrar(id: number) {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }

}