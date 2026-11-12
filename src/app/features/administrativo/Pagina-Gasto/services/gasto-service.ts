import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Gasto } from '../models/gasto';
import { GastoNuevo } from '../models/gasto-nuevo';
import { GastoActualizar } from '../models/gasto-actualizar';

@Injectable({
    providedIn: 'root'
})
export class GastoService {

    private http: HttpClient = inject(HttpClient);
    private readonly API_URL = '/api/gastos';

    getGastos() {
        return this.http.get<Gasto[]>(this.API_URL);
    }

    getGasto(id: number) {
        return this.http.get<Gasto>(`${this.API_URL}/${id}`);
    }

    getGastosPorProveedor(nombre: string) {
        return this.http.get<Gasto[]>(
            `${this.API_URL}/proveedor/${encodeURIComponent(nombre)}`
        );
    }

    guardarGasto(gasto: GastoNuevo) {
        return this.http.post<Gasto>(this.API_URL, gasto);
    }

    actualizarGasto(id: number, gasto: GastoActualizar) {
        return this.http.put<Gasto>(`${this.API_URL}/${id}`, gasto);
    }

    eliminarGasto(id: number) {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }
}
