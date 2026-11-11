import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { Obra_Social, Obra_SocialNueva } from '../Model/Obra_Social';

@Injectable({
    providedIn: 'root'
})
export class ObraSocialService {
    private http:HttpClient = inject(HttpClient);
    private readonly API_URL = "/api/obras-sociales";

    getObrasSociales(){
        return this.http.get<Obra_Social[]>(this.API_URL);
    }

    getObraSocial(id: number){
        return this.http.get<Obra_Social>(`${this.API_URL}/${id}`);
    }

    guardarObraSocial(obra: Obra_SocialNueva){
        return this.http.post<Obra_Social>(this.API_URL, obra);
    }

    actualizarObraSocual(id: number, obra: Obra_SocialNueva){
        return this.http.put<Obra_Social>(`${this.API_URL}/${id}`, obra);
    }

    borrarObraSocial(id: number){
        return this.http.delete<Obra_Social>(`${this.API_URL}/${id}`);
    }
}
