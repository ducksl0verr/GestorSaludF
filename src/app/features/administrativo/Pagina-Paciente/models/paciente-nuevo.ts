export interface PacienteNuevo {
    nombre: string;
    apellido: string;
    fecha_nacimiento: string;
    dni: string;
    numeroAfiliado: number;
    domicilio: DomicilioNuevo;
    id_obraSocial: number;
    contacto: ContactoNuevo;
}


/// hasta que se creen las entidades
export interface DomicilioNuevo {
    calle: string;
    numero: string;
    piso: string;
    depto: string;
    localidad: string;
    provincia: string;
    codigo_postal: string;
    pais: string;
}

export interface ContactoNuevo {
    email: string;
    telefono: string;
}