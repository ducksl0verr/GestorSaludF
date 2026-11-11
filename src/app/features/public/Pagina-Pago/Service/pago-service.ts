import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { Pago, PagoNuevo } from '../Model/Pago';

@Injectable({
    providedIn: 'root'
})
export class PagoService {
    private http:HttpClient = inject(HttpClient);
    private readonly API_URL = "/api/pagos";

    getPagos(){
        return this.http.get<Pago[]>(this.API_URL);
    }

    getPago(id: number){
        return this.http.get<Pago>(`${this.API_URL}/${id}`);
    }

    guardarPago(pago: PagoNuevo){
        return this.http.post<Pago>(this.API_URL, pago);
    }

}
