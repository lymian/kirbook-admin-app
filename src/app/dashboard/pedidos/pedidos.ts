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
    const accion = this.accionPendiente; // Capturamos el valor localmente

    const observable = accion === 'finalizar'
      ? this.pedidoService.finalizarPedido(id)
      : this.pedidoService.cancelarPedido(id);

    observable.subscribe({
      next: () => {
        this.mostrarExito(`Pedido ${accion === 'finalizar' ? 'finalizado' : 'cancelado'} correctamente.`);
        this.obtenerPedidos();
      },
      error: (err) => {
        this.mostrarError(err || `Error al ${accion} el pedido.`);
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

  /** ----------- EXPORTAR PDF (BOLETA) ----------- */
  exportarPDF(pedido: PedidoResponseDTO) {
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((autoTableModule) => {
        const doc = new jsPDF.default();
        const autoTable = autoTableModule.default;

        // --- Encabezado ---
        doc.setFontSize(18);
        doc.text('Boleta de Venta Electrónica', 14, 22);

        doc.setFontSize(12);
        doc.text('KirBook Librería', 14, 30);
        doc.setFontSize(10);
        doc.text('RUC: 20123456789', 14, 36);
        doc.text('Dirección: Av. Principal 123, Lima', 14, 42);

        // --- Datos del Pedido ---
        doc.setLineWidth(0.5);
        doc.line(14, 48, 196, 48); // Línea separadora

        doc.setFontSize(11);
        doc.text(`Nro. Pedido: ${pedido.id}`, 14, 58);
        doc.text(`Fecha: ${new Date(pedido.fecha).toLocaleString()}`, 14, 64);

        doc.text('Datos del Cliente:', 14, 74);
        doc.setFontSize(10);
        doc.text(`Nombre: ${pedido.nombreCliente} ${pedido.apellidoCliente}`, 14, 80);
        doc.text(`Usuario: ${pedido.usernameCliente}`, 14, 86);
        doc.text(`Teléfono: ${pedido.numeroCliente || '-'}`, 14, 92);

        // --- Tabla de Productos ---
        autoTable(doc, {
          startY: 100,
          head: [['Producto', 'Cant.', 'P. Unit', 'Desc.', 'Subtotal']],
          body: pedido.detalles.map((d) => [
            d.libroTitulo,
            d.cantidad,
            `S/ ${d.precioUnitario.toFixed(2)}`,
            `S/ ${(d.descuentoAplicado * d.cantidad).toFixed(2)}`,
            `S/ ${d.subtotal.toFixed(2)}`
          ]),
          foot: [['', '', '', 'TOTAL', `S/ ${pedido.total.toFixed(2)}`]],
          theme: 'striped',
          headStyles: { fillColor: [41, 128, 185] }, // Azul
          footStyles: { fillColor: [44, 62, 80], fontStyle: 'bold' }
        });

        // --- Pie de Página ---
        const finalY = (doc as any).lastAutoTable.finalY + 10;
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text('Gracias por su compra en KirBook.', 14, finalY);

        // --- Guardar ---
        doc.save(`boleta_venta_${pedido.id}.pdf`);
      });
    });
  }
}
