import { Contacto } from "../../features/public/contacto/models/Contacto";
import { Roles } from "../../features/public/enums/Roles";

export interface UsuarioRespuesta{
    idUsuario: number;
    nombre: string;
    apellido: string;
    dni: string;
    contacto: Contacto;
    role: Roles;
}