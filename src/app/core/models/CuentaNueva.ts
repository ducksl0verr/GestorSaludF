import { Contacto } from "../../features/public/contacto/models/Contacto";
import { Roles } from "../../features/public/enums/Roles";

export interface CuentaNueva{ 
  nombre: string;
  apellido: string;
  matricula: string;
  dni: string;
  contacto: Contacto;
  username: string;
  password: string;
  role: Roles;
}

export type CuentaNuevaPedido = Omit<CuentaNueva, 'matricula'> & {
  matricula: string | null;
};