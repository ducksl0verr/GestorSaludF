import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { HistoriaClinica } from '../model/historia-clinica';

@Injectable({
  providedIn: 'root'
})
export class HistoriaClinicaService {
  private http = inject(HttpClient);
  private readonly api_Url = "http://localhost:3000/historias-clinicas";

  getHistorias() {
    return this.http.get<HistoriaClinica[]>(this.api_Url);
  }

  getHistoria(id: string) {
    return this.http.get<HistoriaClinica>(`${this.api_Url}/${id}`);
  }

  postHistoria(historia: HistoriaClinica) {
    return this.http.post<HistoriaClinica>(this.api_Url, historia);
  }

  putHistoria(historia: HistoriaClinica) {
    return this.http.put<HistoriaClinica>(`${this.api_Url}/${historia.id}`, historia);
  }

  deleteHistoria(id: string) {
    return this.http.delete<void>(`${this.api_Url}/${id}`);
  }
}
