import { Paciente } from '../../Pagina-Paciente/models/paciente';

export interface Pago {
    id: number;
    monto: number;
    fecha: string;
    pacientes: Paciente[];
}
