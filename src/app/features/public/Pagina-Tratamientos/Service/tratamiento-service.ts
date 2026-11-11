import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { Tratamiento, TratamientoNuevo } from '../Model/Tratamiento';

@Injectable({
    providedIn:'root'
})
export class TratamientoService {
    private http:HttpClient = inject(HttpClient);
    private readonly API_URL = "/api/tratamientos";

    getTratamiento(id: number){
        return this.http.get<Tratamiento>(`${this.API_URL}/${id}`);
    }

    getTratamientos(){
        return this.http.get<Tratamiento[]>(this.API_URL);
    }

    guardarTratamiento(t : TratamientoNuevo){
        return this.http.post<Tratamiento>(this.API_URL, t);
    }

    actualizarTratamiento(id: number, t: TratamientoNuevo){
        return this.http.put<Tratamiento>(`${this.API_URL}/${id}`, t)
    }

    borrarTratamiento(id: number){
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }
}
