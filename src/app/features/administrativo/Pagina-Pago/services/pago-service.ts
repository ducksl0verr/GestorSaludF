import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Pago } from '../models/pago';
import { PagoNuevo } from '../models/pago-nuevo';
import { PagoActualizar } from '../models/pago-actualizar';

@Injectable({
    providedIn: 'root'
})
export class PagoService {

    private http: HttpClient = inject(HttpClient);
    private readonly API_URL = '/api/pagos';

    getPagos() {
        return this.http.get<Pago[]>(this.API_URL);
    }

    getPago(id: number) {
        return this.http.get<Pago>(`${this.API_URL}/${id}`);
    }

    guardarPago(pago: PagoNuevo) {
        return this.http.post<Pago>(this.API_URL, pago);
    }

    actualizarPago(id: number, pago: PagoActualizar) {
        return this.http.put<Pago>(`${this.API_URL}/${id}`, pago);
    }

    eliminarPago(id: number) {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }
}
