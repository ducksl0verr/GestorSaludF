import { Diagnostico } from "../../Pagina-Diagnostico/model/diagnostico"

export interface HistoriaClinica {
    id: number,
    fecha: string,
    observaciones: string,
    evolucion: string,
    id_paciente: number,
    nombre_paciente?: string,
    apellido_paciente?: string,
    id_profesional: number,
    nombre_profesional?: string,
    apellido_profesional?: string,
    diagnosticos: Diagnostico[]
}

export interface DiagnosticoDeHistoriaNueva {
    nombre: string,
    descripcion: string,
    fechaDiagnostico: string
}

export interface HistoriaClinicaNueva {
    fecha: string,
    observaciones: string,
    evolucion: string,
    id_paciente: number,
    id_profesional: number,
    ids_diagnosticos: number[],
    diagnosticos: DiagnosticoDeHistoriaNueva[]
}

export interface HistoriaClinicaActualizar {
    observaciones: string,
    evolucion: string
}
