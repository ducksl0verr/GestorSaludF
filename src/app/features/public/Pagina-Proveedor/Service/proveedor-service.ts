import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { Proveedor, ProveedorActualizar, ProveedorNuevo } from '../model/Proveedor';
import { Mensaje } from '../Notificaciones/Model/Mensaje';

@Injectable({
    providedIn: 'root'
})
export class ProveedorService {
    private http:HttpClient = inject(HttpClient);
    private readonly API_URL ="/api/proveedores";

    getProveedores(){
        return this.http.get<Proveedor[]>(this.API_URL);
    }

    getProveedor(id: number){
        return this.http.get<Proveedor>(`${this.API_URL}/${id}`);
    }

    guardarProveedor(pro : ProveedorNuevo){
        return this.http.post<Proveedor>(this.API_URL, pro);
    }

    actualizarProveedor(id: number, pro: ProveedorActualizar){
        return this.http.put<Proveedor>(`${this.API_URL}/${id}`, pro);
    }

    borrar(id: number){
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }

    enviarMensaje(id: number, m: Mensaje){
        return this.http.post(`/api/usuarios/${id}/mensaje`, m, { responseType: 'text'});
    }
}
