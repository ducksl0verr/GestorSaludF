import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { Diagnostico } from '../model/diagnostico';

@Injectable({
  providedIn: 'root'
})
export class DiagnosticoService {

private http = inject(HttpClient);
  private readonly api_Url = "/api/diagnosticos";

  getDiagnosticos() {
    return this.http.get<Diagnostico[]>(this.api_Url);
  }

  getDiagnostico(id: string) {
    return this.http.get<Diagnostico>(`${this.api_Url}/${id}`);
  }

  postDiagnostico(diagnostico: Diagnostico) {
    return this.http.post<Diagnostico>(this.api_Url, diagnostico);
  }

  putDiagnostico(diagnostico: Diagnostico) {
    return this.http.put<Diagnostico>(`${this.api_Url}/${diagnostico.id}`, diagnostico);
  }

  deleteDiagnostico(id: string) {
    return this.http.delete<void>(`${this.api_Url}/${id}`);
  }

}