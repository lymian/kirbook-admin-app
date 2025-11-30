export interface Cliente {
    id: number;
    username: string;
    rol: string;
    nombre: string;
    apellido: string;
    numero: string;
    correo: string;
    estado: boolean;
    fechaRegistro: string | null;
}

export interface ClienteResponseDTO {
    cliente: Cliente;
    pedidosPendientes: number;
    pedidosFinalizados: number;
    pedidosCancelados: number;
}
