import { Roles } from "../../../public/enums/Roles";

export interface UsuarioFormularioModel {
    nombre: string;
    apellido: string;
    dni: string;
    matricula: string;
    contacto: {
        telefono: string,
        email: string;
    }
    username: string;
    password: string;
    role: Roles | '';
}