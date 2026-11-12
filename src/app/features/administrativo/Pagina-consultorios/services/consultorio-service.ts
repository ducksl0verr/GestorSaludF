import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Consultorio } from '../models/consultorio';
import { ConsultorioNuevo } from '../models/consultorio-nuevo';
import { ConsultorioActualizar } from '../models/consultorio-actualizar';

@Injectable({
    providedIn: 'root'
})
export class ConsultorioService {

    private http: HttpClient = inject(HttpClient);
    private readonly API_URL = '/api/consultorios';

    getConsultorios() {
        return this.http.get<Consultorio[]>(this.API_URL);
    }

    getConsultorio(id: number) {
        return this.http.get<Consultorio>(`${this.API_URL}/${id}`);
    }

    guardarConsultorio(consultorio: ConsultorioNuevo) {
        return this.http.post<Consultorio>(this.API_URL, consultorio);
    }

    actualizarConsultorio(id: number, consultorio: ConsultorioActualizar) {
        return this.http.put<Consultorio>(`${this.API_URL}/${id}`, consultorio);
    }

    eliminarConsultorio(id: number) {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }
}