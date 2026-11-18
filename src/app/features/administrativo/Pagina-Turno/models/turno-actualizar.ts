import { EstadoTurno } from "./estado-turno";

export interface TurnoActualizar {
    fechaHora: string;
    estadoTurno: EstadoTurno; ///provisorio hasta que este el enum de estados de turno
}