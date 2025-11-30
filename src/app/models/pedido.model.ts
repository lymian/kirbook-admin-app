export interface DetallePedidoDTO {
    id: number;
    idPedido: number;
    libroId: number;
    libroTitulo: string;
    cantidad: number;
    precioUnitario: number;
    descuentoAplicado: number;
    subtotal: number;
}

export interface PedidoResponseDTO {
    id: number;
    fecha: string;
    fechaFinalizado: string;
    estado: string;
    total: number;
    clienteId: number;
    usernameCliente: string;
    nombreCliente: string;
    apellidoCliente: string;
    numeroCliente: number;
    detalles: DetallePedidoDTO[];
}
