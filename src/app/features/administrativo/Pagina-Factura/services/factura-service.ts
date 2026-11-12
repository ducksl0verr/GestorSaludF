import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Factura } from '../models/factura';
import { FacturaNueva } from '../models/factura-nueva';

@Injectable({
    providedIn: 'root'
})
export class FacturaService {

    private http: HttpClient = inject(HttpClient);
    private readonly API_URL = '/api/facturas';

    getFacturas() {
        return this.http.get<Factura[]>(this.API_URL);
    }

    getFactura(id: number) {
        return this.http.get<Factura>(`${this.API_URL}/${id}`);
    }

    guardarFactura(factura: FacturaNueva) {
        return this.http.post<Factura>(this.API_URL, factura);
    }
}
