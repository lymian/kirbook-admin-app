import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  private apiUrl = 'https://kirbook.api.lymian.xyz/auth';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    const body = { username, password };

    return this.http.post<any>(`${this.apiUrl}/login`, body)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // Manejo de error 400
          if (error.status === 400 && error.error?.error) {
            return throwError(() => new Error(error.error.error));
          }

          // Otros errores
          return throwError(() => new Error('Ocurrió un error inesperado.'));
        })
      );
  }
}
