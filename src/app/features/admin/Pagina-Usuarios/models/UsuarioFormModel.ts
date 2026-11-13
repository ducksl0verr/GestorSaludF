import { Roles } from "../../../auth/enums/Roles";

export interface UsuarioFormModel {
  nombre: string;
  apellido: string;
  dni: string;
  matricula: string;
  contacto: { 
    email: string; 
    telefono: string };
  username: string;
  password: string;
  role: Roles;
}