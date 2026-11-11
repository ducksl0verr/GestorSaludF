export interface Paciente { ///vendria a ser el paciente Respuesta, verificar si es correcto
    id: number;
    nombre: string;
    apellido: string;
    fecha_nacimiento: string;
    dni: string;
    numeroAfiliado: number;
    contacto: ContactoRespuesta;
    domicilio: DomicilioRespuesta;
    id_obraSocial: number;
    nombreObraSocial: string;
    coberturaObraSocial: string;
    tratamientos: any[]; ///any supongo que deberia ser reemplazado por el tratamiento model 
}

///provisorio hasta que se creen las entidades 
export interface DomicilioRespuesta {
    calle: string;
    numero: string;
    piso: string;
    depto: string;
    localidad: string;
    provincia: string;
    codigo_postal: string;
}

export interface ContactoRespuesta {
    email: string;
    telefono: string;
}