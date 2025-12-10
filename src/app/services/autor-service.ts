import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Autor, AutorRequestDTO } from '../models/autor.model';

@Injectable({
  providedIn: 'root',
})
export class AutorService {

  private apiUrl = 'https://kirbook.api.lymian.xyz/autores';

  constructor(private http: HttpClient) { }

  /** Obtener todos los autores hey*/
  obtenerAutores(): Observable<Autor[]> {
    return this.http.get<Autor[]>(this.apiUrl);
  }

  /** Crear autor */
  crearAutor(dto: AutorRequestDTO): Observable<Autor> {
    return this.http.post<Autor>(this.apiUrl, dto);
  }

  /** Actualizar autor */
  actualizarAutor(id: number, dto: AutorRequestDTO): Observable<Autor> {
    return this.http.put<Autor>(`${this.apiUrl}/${id}`, dto);
  }

  /** Eliminar autor */
  eliminarAutor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
