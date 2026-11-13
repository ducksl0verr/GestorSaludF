import { Contacto } from "../../../public/contacto/models/Contacto";
import { Roles } from "../../../auth/enums/Roles";

export interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    dni: string;
    contacto: Contacto;
    role: Roles;
}

export interface UsuarioDTO {
    nombre: string;
    apellido: string;
    dni: string;
    contacto: Contacto;
    role: Roles;
}