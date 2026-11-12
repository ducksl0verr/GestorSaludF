import { Contacto } from "../../../public/contacto/models/Contacto";
import { Domicilio } from "../../../public/Pagina-Domicilio/Model/Domicilio";

export interface PacienteNuevo {
    nombre: string;
    apellido: string;
    fecha_nacimiento: string;
    dni: string;
    numeroAfiliado: number;
    domicilio: Domicilio;
    id_obraSocial: number;
    contacto: Contacto;
}


