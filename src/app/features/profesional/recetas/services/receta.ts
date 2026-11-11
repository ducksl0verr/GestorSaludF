import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { Receta } from '../model/receta';

@Injectable({
  providedIn: 'root'
})
export class RecetaService {
  private http = inject(HttpClient);
  private readonly api_Url = "http://localhost:3000/recetas";

  getRecetas() {
    return this.http.get<Receta[]>(this.api_Url);
  }

  getReceta(id: string) {
    return this.http.get<Receta>(`${this.api_Url}/${id}`);
  }

  postReceta(receta: Receta) {
    return this.http.post<Receta>(this.api_Url, receta);
  }

  putReceta(receta: Receta) {
    return this.http.put<Receta>(`${this.api_Url}/${receta.id}`, receta);
  }

  deleteReceta(id: string) {
    return this.http.delete<void>(`${this.api_Url}/${id}`);
  }
}
