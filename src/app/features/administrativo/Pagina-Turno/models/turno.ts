import { EstadoTurno } from "./estado-turno";

export interface Turno {
    id: number;
    fechaHora: string;
    estadoFacturacionDeTurno: string;
    estadoTurno: EstadoTurno;
    id_paciente: number;
    id_tratamiento: number;
    id_consultorio: number;
    id_profesional: number;
}