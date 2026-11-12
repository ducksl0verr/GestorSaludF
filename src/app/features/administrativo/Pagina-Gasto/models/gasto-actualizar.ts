import { MetodoPago } from './metodo-pago';
import { TipoGasto } from './tipo-gasto';

export interface GastoActualizar {
    fecha: string;
    descripcion: string;
    monto: number;
    tipoGasto: TipoGasto;
    metodoPago: MetodoPago;
    observaciones: string;
}
