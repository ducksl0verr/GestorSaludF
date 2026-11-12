import { MetodoPago } from './metodo-pago';
import { TipoGasto } from './tipo-gasto';

export interface Gasto {
    id: number;
    fecha: string;
    descripcion: string;
    monto: number;
    tipoGasto: TipoGasto;
    nombreProveedor: string;
    metodoPago: MetodoPago;
    observaciones: string;
}
