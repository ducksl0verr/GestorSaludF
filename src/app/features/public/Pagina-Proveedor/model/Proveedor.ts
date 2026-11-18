import { Contacto } from "../../contacto/models/Contacto";
import { Domicilio } from "../../Pagina-Domicilio/Model/Domicilio";
import { TipoProveedor } from "../enums/TipoProveedor";

export interface Proveedor {
    id: number,
    nombre: string,
    contacto: Contacto,
    cuil: string,
    direccion: Domicilio[],
    tipo: TipoProveedor
}

export interface ProveedorNuevo{
    nombre: string,
    contacto: Contacto,
    cuil: string;
    direccion: Domicilio[],
    tipo: TipoProveedor;
}

export interface ProveedorActualizar {
    nombre: string,
    contacto: Contacto,
    direccion: Domicilio[];
}