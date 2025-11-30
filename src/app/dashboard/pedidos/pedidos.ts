import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidoService } from '../../services/pedido-service';
import { PedidoResponseDTO } from '../../models/pedido.model';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedidos.html',
  styleUrls: ['./pedidos.css'],
})
export class Pedidos implements OnInit {
  pedidos: PedidoResponseDTO[] = [];
  cargando = false;
  estadoSeleccionado = 'pendiente'; // Default

  // Paginación
  page = 0;
  size = 10;
  totalPages = 0;
  totalElements = 0;
  first = true;
  last = true;
  pagesArray: number[] = [];

  // Modales
  modalExito = '';
  modalError = '';
  modalConfirmar = false;
  modalDetalle = false;

  pedidoSeleccionado: PedidoResponseDTO | null = null;
  accionPendiente: 'finalizar' | 'cancelar' | null = null;

  constructor(private pedidoService: PedidoService) { }

  ngOnInit(): void {
    this.obtenerPedidos();
  }

  /** ----------- LISTADO ----------- */
  obtenerPedidos() {
    this.cargando = true;
    this.pedidoService.obtenerPedidosPorEstadoPaginado(this.estadoSeleccionado, this.page, this.size).subscribe({
      next: (data) => {
        this.pedidos = data.content;
        this.totalPages = data.totalPages;
        this.totalElements = data.totalElements;
        this.first = data.first;
        this.last = data.last;
        this.cargando = false;
        this.calcularPaginas();
      },
      error: () => {
        this.mostrarError('No se pudieron cargar los pedidos.');
        this.cargando = false;
      },
    });
  }

  cambiarEstado(estado: string) {
    this.estadoSeleccionado = estado;
    this.page = 0; // Reset page
    this.obtenerPedidos();
  }

  cambiarPagina(newPage: number) {
    this.page = newPage;
    this.obtenerPedidos();
  }

  calcularPaginas() {
    this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i);
  }

  /** ----------- DETALLES ----------- */
  verDetalles(pedido: PedidoResponseDTO) {
    this.pedidoSeleccionado = pedido;
    this.modalDetalle = true;
  }

  cerrarDetalles() {
    this.modalDetalle = false;
    this.pedidoSeleccionado = null;
  }

  /** ----------- ACCIONES ----------- */
  confirmarAccion(pedido: PedidoResponseDTO, accion: 'finalizar' | 'cancelar') {
    this.pedidoSeleccionado = pedido;
    this.accionPendiente = accion;
    this.modalConfirmar = true;
  }

  cancelarConfirmacion() {
    this.modalConfirmar = false;
    this.pedidoSeleccionado = null;
    this.accionPendiente = null;
  }

  ejecutarAccion() {
    if (!this.pedidoSeleccionado || !this.accionPendiente) return;

    const id = this.pedidoSeleccionado.id;
    const observable = this.accionPendiente === 'finalizar'
      ? this.pedidoService.finalizarPedido(id)
      : this.pedidoService.cancelarPedido(id);

    observable.subscribe({
      next: () => {
        this.mostrarExito(`Pedido ${this.accionPendiente === 'finalizar' ? 'finalizado' : 'cancelado'} correctamente.`);
        this.obtenerPedidos();
      },
      error: (err) => {
        this.mostrarError(err || `Error al ${this.accionPendiente} el pedido.`);
      }
    });

    this.cancelarConfirmacion();
  }

  /** ----------- MODALES ----------- */
  mostrarExito(msg: string) {
    this.modalExito = msg;
    setTimeout(() => (this.modalExito = ''), 3000);
  }

  mostrarError(msg: string) {
    this.modalError = msg;
  }
}
