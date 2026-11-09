import { Contacto } from "../../../public/contacto/models/Contacto";
import { Roles } from "../../../public/enums/Roles";

export interface Usuario {
    id?: number;
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
    username: string;
    password: string;
    role: Roles;
}