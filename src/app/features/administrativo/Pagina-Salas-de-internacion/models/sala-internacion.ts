import { Paciente } from "../../Pagina-Paciente/models/paciente";

export interface SalaInternacion {
    id: number;
    capacidad_maxima: number;
    pacientes: Paciente[];
}