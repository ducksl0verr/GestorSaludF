export interface Turno {
    id: number;
    fechaHora: string;
    estadoFacturacionDeTurno: string;
    estadoTurno: string;
    id_paciente: number;
    id_tratamiento: number;
    id_consultorio: number;
    id_profesional: number;
}