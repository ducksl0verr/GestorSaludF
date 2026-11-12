import { Contacto } from "../../../public/contacto/models/Contacto";
import { Domicilio } from "../../../public/Pagina-Domicilio/Model/Domicilio";
import { PrescripcionTratamiento } from "../../Pagina-Prescripcion-Tratamiento/models/prescripcion-tratamiento";

export interface Paciente { ///vendria a ser el paciente Respuesta, verificar si es correcto
    id: number;
    nombre: string;
    apellido: string;
    fecha_nacimiento: string;
    dni: string;
    numeroAfiliado: number;
    contacto: Contacto;
    domicilio: Domicilio;
    id_obraSocial: number;
    nombreObraSocial: string;
    coberturaObraSocial: string;
    tratamientos: PrescripcionTratamiento[]; 
}




