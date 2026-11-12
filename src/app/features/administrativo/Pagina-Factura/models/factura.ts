import { DetalleFactura } from './detalle-factura';
import { EstadoFactura } from './estado-factura';

export interface Factura {
    id: number;
    numero_factura: string;
    fechaEmision: string;
    fechaVencimiento: string;
    total: number;
    estadoFactura: EstadoFactura;
    detalles?: DetalleFactura[];
}
