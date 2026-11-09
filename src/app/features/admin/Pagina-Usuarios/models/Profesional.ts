import { Contacto } from "../../../public/contacto/models/Contacto";
import { Roles } from "../../../public/enums/Roles";

export interface Profesional {
    id: number;
    nombre: string;
    apellido: string;
    dni: string;
    matricula: string;
    contacto: Contacto;
    role: Roles;
}

export interface ProfesionalDTO {
    nombre: string;
    apellido: string;
    dni: string;
    matricula: string;
    contacto: Contacto;
    role: Roles;
}