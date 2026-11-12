export interface Medicamento{
    id: number,
    nombre: string,
    principioActivo: string,
    laboratorio: string,
    descripcion: string,
    stock: number,
    precio: number,
    fechaVencimiento: string
}

export interface MedicamentoActualizar{
    nombre: string,
    principioActivo: string,
    laboratorio: string,
    descripcion: string,
    stock: number,
    precio: number,
}

export interface MedicamentoNuevo{
    nombre: string,
    principioActivo: string,
    laboratorio: string,
    descripcion: string,
    stock: number,
    precio: number,
    fechaVencimiento: string
}