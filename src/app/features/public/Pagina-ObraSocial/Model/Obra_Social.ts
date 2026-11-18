import { Domicilio } from "../../Pagina-Domicilio/Model/Domicilio";

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