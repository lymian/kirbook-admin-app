import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private baseUrl = 'http://localhost:8080/categorias';

  constructor(private http: HttpClient) { }

  // ============================
  //   GET - LISTAR CATEGORÍAS
  // ============================
  obtenerCategorias(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  // ============================
  //   GET - OBTENER POR ID
  // ============================
  obtenerCategoriaPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // ============================
  //   MANEJO GLOBAL DE ERRORES
  // ============================
  private handleError(error: any) {
    let mensaje = 'Error al obtener categorías';

    if (error.error?.error) {
      mensaje = error.error.error;
    }

    return throwError(() => mensaje);
  }
}
