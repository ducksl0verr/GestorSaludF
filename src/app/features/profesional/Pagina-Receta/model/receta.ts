
export interface Receta {
    id: number,
    fecha: string,
    descripcion?: string | null,
    id_paciente: number,
    nombre_paciente?: string,
    apellido_paciente?: string,
    id_profesional: number,
    nombre_profesional?: string,
    apellido_profesional?: string,
    detalles: DetalleRecetaRespuesta[]
}

export interface RecetaNueva {
    id_paciente: number,
    id_profesional: number,
    descripcion: string,
    detalles: DetalleRecetaNuevo[]
}
export interface DetalleRecetaNuevo {
  dosis: string;
  frecuencia: string;
  cantidad: number;
  id_medicamento: number;
}
export interface DetalleRecetaRespuesta {
  id: number;
  dosis: string;
  frecuencia: string;
  cantidad: number;
  nombreMedicamento: string;
  idMedicamento: number;
}