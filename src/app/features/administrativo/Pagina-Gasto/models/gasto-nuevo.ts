import { MetodoPago } from './metodo-pago';
import { TipoGasto } from './tipo-gasto';

export interface GastoNuevo {
    fecha: string;
    descripcion: string;
    monto: number;
    tipoGasto: TipoGasto;
    nombreProveedor: string;
    metodoPago: MetodoPago;
    observaciones: string;
}
