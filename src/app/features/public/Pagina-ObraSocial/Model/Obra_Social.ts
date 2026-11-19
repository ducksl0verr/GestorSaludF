import { Domicilio } from "../../Pagina-Domicilio/Model/Domicilio";

/** Nombre de la obra social predeterminada para pacientes sin cobertura. */
export const NOMBRE_SIN_OBRA_SOCIAL = 'Sin obra social';

export interface Obra_Social{
    id: number,
    nombre: string,
    cobertura: string,
    domicilios: Domicilio[]
}

export interface Obra_SocialNueva{
    nombre: string,
    cobertura: string,
    domicilios: Domicilio[]
}