import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HistoriaClinica, HistoriaClinicaActualizar, HistoriaClinicaNueva } from '../model/historia-clinica';



@Injectable({
    providedIn: 'root'
})
export class HistoriaClinicaService {

    private http: HttpClient = inject(HttpClient);
    private readonly API_URL = "/api/historiasClinicas";

    getHistoriasClinicas() {
        return this.http.get<HistoriaClinica[]>(this.API_URL);
    }

    getHistoriaClinica(id: number) {
        return this.http.get<HistoriaClinica>(`${this.API_URL}/${id}`);
    }

    guardarHistoriaClinica(historia: HistoriaClinicaNueva) {
        return this.http.post<HistoriaClinica>(this.API_URL, historia);
    }

    actualizarHistoriaClinica(id: number, historia: HistoriaClinicaActualizar) {
        return this.http.put<HistoriaClinica>(`${this.API_URL}/${id}`, historia);
    }

    borrar(id: number) {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }
}