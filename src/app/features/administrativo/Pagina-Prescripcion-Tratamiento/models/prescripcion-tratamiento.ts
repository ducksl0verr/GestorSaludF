export interface PrescripcionTratamiento {
    id: number;
    id_tratamiento: number;
    nombre_tratamiento: string;
    activo: boolean;
    fecha_inicio: string;
    fecha_final: string | null;
}