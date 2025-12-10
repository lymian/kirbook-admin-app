import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ClienteResponseDTO } from '../models/cliente.model';

@Injectable({
    providedIn: 'root'
})
export class ClienteService {
    private baseUrl = 'https://kirbook.api.lymian.xyz/clientes';

    constructor(private http: HttpClient) { }

    obtenerClientes(): Observable<ClienteResponseDTO[]> {
        return this.http.get<ClienteResponseDTO[]>(`${this.baseUrl}/listar`).pipe(
            catchError(this.handleError)
        );
    }

    alternarEstadoCliente(id: number, estado: boolean): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/alternar-estado/${id}/${estado}`).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse) {
        console.error('An error occurred:', error);
        return throwError(() => new Error('Algo salió mal; por favor intente nuevamente más tarde.'));
    }
}
