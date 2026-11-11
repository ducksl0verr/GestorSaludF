import { Contacto } from "../../../public/contacto/models/Contacto";
import { Domicilio } from "../../../public/Pagina-Domicilio/Model/Domicilio";

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
    tratamientos: any[]; ///any supongo que deberia ser reemplazado por el tratamiento model 
}

