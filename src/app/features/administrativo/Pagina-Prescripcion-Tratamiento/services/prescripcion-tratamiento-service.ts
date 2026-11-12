
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { PrescripcionTratamiento } from "../models/prescripcion-tratamiento";
import { PrescripcionTratamientoNueva } from "../models/prescripcion-tratamiento-nueva";

@Injectable({
    providedIn: 'root'
})
export class PrescripcionTratamientoService {

    private http: HttpClient = inject(HttpClient);
    private readonly API_URL = '/api/prescripciones';

    getPrescripcionTratamiento(id: number) {
        return this.http.get<PrescripcionTratamiento>(`${this.API_URL}/${id}`);
    }

    getPrescripcionesTratamiento() {
        return this.http.get<PrescripcionTratamiento[]>(this.API_URL);
    }

    darBajaPrescripcionTratamiento(id: number) {
        return this.http.put<PrescripcionTratamiento>(`${this.API_URL}/${id}/baja`, null);
    }

    registrarPrescripcionTratamiento(prescripcion: PrescripcionTratamientoNueva) {
    return this.http.post<PrescripcionTratamiento>(this.API_URL,prescripcion);
}


    
}
