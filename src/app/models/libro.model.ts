export interface LibroResponseDTO {
    id: number;
    titulo: string;
    sinopsis: string;
    fechaPublicacion: string; // formato YYYY-MM-DD
    precio: number;
    estado: boolean;
    descuento: number;
    stock: number;

    autorId: number;
    autorNombre: string;

    categoriaId: number;
    categoriaNombre: string;
}

export interface LibroRequestDTO {
    titulo: string;
    sinopsis: string;
    fechaPublicacion: string; // YYYY-MM-DD
    precio: number;
    estado: boolean;
    descuento: number;
    stock: number;

    autorId: number;
    categoriaId: number;
}
