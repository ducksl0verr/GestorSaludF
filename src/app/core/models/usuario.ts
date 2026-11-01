import { Contacto } from "../../features/public/contacto/models/Contacto";
import { Roles } from "../../features/public/enums/Roles";

export interface Usuario{
    id?: number,
    nombre: string,
    apellido: string,
    matriucla: string,
    dni: string,
    username: string,
    contacto: Contacto,
    password: string,
    rol: Roles
}