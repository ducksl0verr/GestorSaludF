import { Contacto } from "../../features/public/contacto/models/Contacto";
import { Roles } from "../../features/auth/enums/Roles";

export interface UsuarioRespuesta{
    idUsuario: number;
    nombre: string;
    apellido: string;
    dni: string;
    contacto: Contacto;
    role: Roles;
}