
export interface Receta {
    id: number,
    fecha: string,
    id_paciente: number,
    id_profesional: number,
    detalles: DetalleRecetaRespuesta[]
}

export interface RecetaNueva {
    id_paciente: number,
    id_profesional: number,
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