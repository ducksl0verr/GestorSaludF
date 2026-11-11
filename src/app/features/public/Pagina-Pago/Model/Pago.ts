export interface Pago{
    id: number,
    monto: number,
    fecha: string,
    idsPacientes: string[] //cambiar
}

export interface PagoNuevo{
    monto: number,
    fecha: string,
    idsPacientes: number[]
}