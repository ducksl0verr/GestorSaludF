export interface Diagnostico {
    id: number,
    nombre: string,
    descripcion: string,
    fechaDiagnostico: string,
    idHistoriaClinica: number
}

export interface DiagnosticoNuevo {
    nombre: string,
    descripcion: string,
    fechaDiagnostico: string,
    idHistoriaClinica: number
}
