import { Contacto } from "../../../public/contacto/models/Contacto";
import { Roles } from "../../../public/enums/Roles";
import { Usuario, UsuarioDTO } from "./Usuario";

export interface Profesional extends Usuario{
    matricula: string;
}

export interface ProfesionalDTO extends UsuarioDTO{
    matricula: string;
}

//Esta constante es para decidir qué mostrar según el rol
export const esProfesional = (u: Usuario): u is Profesional => u.role === Roles.ROLE_PROFESIONAL;