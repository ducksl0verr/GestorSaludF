import { HttpClient } from '@angular/common/http';
import { inject, Inject, Injectable, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Paciente } from './model/Paciente';
import { clear } from 'console';

@Injectable({
  providedIn: 'root'
})
export class PacienteServicio {
 private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/pacientes';

 
  buscarPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(this.apiUrl);
  }

  buscarPacientePorId(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.apiUrl}/${id}`);
  }

  crearPaciente(paciente: Paciente): Observable<Paciente> {
    return this.http.post<Paciente>(this.apiUrl, paciente);
  }

  actualizarPaciente(id: number, paciente: Paciente): Observable<Paciente> {
    return this.http.put<Paciente>(`${this.apiUrl}/${id}`, paciente);
  }

  eliminarPaciente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}




