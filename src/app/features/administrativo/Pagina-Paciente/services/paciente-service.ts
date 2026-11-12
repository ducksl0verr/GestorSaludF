import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Paciente } from "../models/paciente";
import { PacienteNuevo } from "../models/paciente-nuevo";
import { PacienteActualizar } from "../models/paciente-actualizar";

@Injectable({
    providedIn: 'root'
})
export class PacienteService {

private http:HttpClient = inject(HttpClient);
private readonly API_URL = '/api/pacientes';


///Pacientes


// Obtener todos los pacientes
getPacientes() {
    return this.http.get<Paciente[]>(this.API_URL);
}

// Obtener un paciente por ID
getPaciente(id: number) {
    return this.http.get<Paciente>(`${this.API_URL}/${id}`);
}

// Actualizar un paciente por ID

actualizarPaciente(id: number, paciente: PacienteActualizar) {
    return this.http.put<Paciente>(`${this.API_URL}/${id}`, paciente);
}


// Registrar un nuevo paciente
registrarPaciente(paciente: PacienteNuevo) {
    return this.http.post<Paciente>(this.API_URL, paciente);
}


// Borrar un paciente por ID
borrarPaciente(id: number) {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
}






}


