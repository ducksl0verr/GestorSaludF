export enum EstadoFactura {
    PENDIENTE = 'PENDIENTE',
    REALIZADA = 'REALIZADA',
    VENCIDA = 'VENCIDA'
}

export const ESTADOS_FACTURA: EstadoFactura[] = [
    EstadoFactura.PENDIENTE,
    EstadoFactura.REALIZADA,
    EstadoFactura.VENCIDA
];
