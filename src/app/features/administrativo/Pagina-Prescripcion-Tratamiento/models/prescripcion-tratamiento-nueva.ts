export interface PrescripcionTratamientoNueva {
    id_paciente: number;
    id_tratamiento: number;
    id_profesional: number;
    fecha_inicio: string;
    fecha_final: string | null;
}