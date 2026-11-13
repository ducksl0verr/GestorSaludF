import { Diagnostico } from "../../Pagina-Diagnostico/model/diagnostico"

export interface HistoriaClinica {
    id: number,
    fecha: string,
    observaciones: string,
    evolucion: string,
    id_paciente: number,
    id_profesional: number,
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
