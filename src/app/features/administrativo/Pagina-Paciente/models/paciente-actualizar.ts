import { Contacto } from "../../../public/contacto/models/Contacto";
import { Domicilio } from "../../../public/Pagina-Domicilio/Model/Domicilio";

export interface PacienteActualizar {
    nombre: string;
    apellido: string;
    fecha_nacimiento: string;
    dni: string;
    numeroAfiliado: number | null;
    domicilio: Domicilio;
    id_obraSocial: number;
    contacto: Contacto;
}
