export interface TurnoNuevo {
    fechaHora: string;
    id_paciente: number;
    id_tratamiento?: number | null;
    id_consultorio: number;
    id_profesional: number;
}
