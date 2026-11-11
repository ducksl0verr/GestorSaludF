import { ContactoNuevo, DomicilioNuevo } from "./paciente-nuevo";

export interface PacienteActualizar {
    nombre: string;
    apellido: string;
    dni: string;
    numeroAfiliado: number;
    domicilio: DomicilioNuevo;
    id_obraSocial: number;
    contacto: ContactoNuevo;
}
