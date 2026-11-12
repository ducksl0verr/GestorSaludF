import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { Medicamento, MedicamentoActualizar, MedicamentoNuevo } from '../Model/Medicamento';

@Injectable({
    providedIn: 'root'
})
export class MedicamentoService {
    private http:HttpClient = inject(HttpClient);
    private readonly API_URL = "/api/medicamentos";

    getMedicamentos(){
        return this.http.get<Medicamento[]>(this.API_URL);
    }

    getMedicamento(id: number){
        return this.http.get<Medicamento>(`${this.API_URL}/${id}`);
    }

    guardarMedicamento(me: MedicamentoNuevo){
        return this.http.post<Medicamento>(this.API_URL, me);
    }

    actualizarMedicamento(id: number, me: MedicamentoActualizar){
        return this.http.put<Medicamento>(`${this.API_URL}/${id}`, me);
    }

    borrarMedicamento(id: number){
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }
}
