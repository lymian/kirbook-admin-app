import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LibroService {
  private baseUrl = 'https://kirbook.api.lymian.xyz/libros';

  constructor(private http: HttpClient) { }

  // ============================
  //   GET - LISTAR LIBROS
  // ============================
  obtenerLibros(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  // ============================
  //   GET - OBTENER POR ID
  // ============================
  obtenerLibroPorId(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // ============================
  //   POST - CREAR LIBRO
  // ============================
  crearLibro(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data).pipe(
      catchError(this.handleError)
    );
  }

  // ============================
  //   PUT - ACTUALIZAR LIBRO
  // ============================
  actualizarLibro(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data).pipe(
      catchError(this.handleError)
    );
  }

  // ============================
  //   DELETE
  // ============================
  eliminarLibro(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // ============================
  //   MANEJO GLOBAL DE ERRORES
  // ============================
  private handleError(error: any) {
    let mensaje = 'Error desconocido';

    if (error.error?.error) {
      mensaje = error.error.error; // mensaje del backend
    }

    return throwError(() => mensaje);
  }

  obtenerLibrosPaginados(page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/paginado?page=${page}&size=${size}`).pipe(
      catchError(this.handleError)
    );
  }
}
