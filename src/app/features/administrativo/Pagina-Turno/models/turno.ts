import { EstadoTurno } from "./estado-turno";

export interface Turno {
    id: number;
    fechaHora: string;
    estadoFacturacionDeTurno: string;
    estadoTurno: EstadoTurno;
    nombrePaciente: string;
    nombreTratamiento: string;
    nombreConsultorio: string;
    nombreProfesional: string;
}
