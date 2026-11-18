import { Contacto } from "../../../public/contacto/models/Contacto";
import { Domicilio } from "../../../public/Pagina-Domicilio/Model/Domicilio";

export interface PacienteActualizar {
    nombre: string;
    apellido: string;
    dni: string;
    numeroAfiliado: number;
    domicilio: Domicilio;
    id_obraSocial: number;
    contacto: Contacto;
}
