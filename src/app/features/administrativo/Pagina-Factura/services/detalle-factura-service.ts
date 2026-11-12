import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { DetalleFactura } from '../models/detalle-factura';
import { DetalleFacturaNueva } from '../models/detalle-factura-nueva';

@Injectable({
    providedIn: 'root'
})
export class DetalleFacturaService {

    private http: HttpClient = inject(HttpClient);
    private readonly API_URL = '/api/detalleFacturas';

    getDetalleFacturas() {
        return this.http.get<DetalleFactura[]>(this.API_URL);
    }

    getDetalleFactura(id: number) {
        return this.http.get<DetalleFactura>(`${this.API_URL}/${id}`);
    }

    guardarDetalleFactura(detalle: DetalleFacturaNueva) {
        return this.http.post<DetalleFactura>(this.API_URL, detalle);
    }

    actualizarDetalleFactura(id: number, detalle: DetalleFacturaNueva) {
        return this.http.put<DetalleFactura>(`${this.API_URL}/${id}`, detalle);
    }

    eliminarDetalleFactura(id: number) {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }
}
