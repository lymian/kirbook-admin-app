import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class PedidoService {
    private baseUrl = 'https://kirbook.api.lymian.xyz/pedidos';

    constructor(private http: HttpClient) { }

    // ============================
    //   GET - OBTENER PEDIDOS POR ESTADO PAGINADO
    // ============================
    obtenerPedidosPorEstadoPaginado(estado: string, page: number, size: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/estado/${estado}/paginado?page=${page}&size=${size}`).pipe(
            catchError(this.handleError)
        );
    }

    // ============================
    //   PUT - FINALIZAR PEDIDO
    // ============================
    finalizarPedido(id: number): Observable<any> {
        return this.http.put(`${this.baseUrl}/finalizar/${id}`, {}).pipe(
            catchError(this.handleError)
        );
    }

    // ============================
    //   PUT - CANCELAR PEDIDO
    // ============================
    cancelarPedido(id: number): Observable<any> {
        return this.http.put(`${this.baseUrl}/cancelar/${id}`, {}).pipe(
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
}
