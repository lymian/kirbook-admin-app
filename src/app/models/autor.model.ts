export interface Autor {
    id: number;
    nombre: string;
    apellido: string;
}

export interface AutorRequestDTO {
    nombre: string;
    apellido: string;
}

export interface AutorResponseDTO {
    id: number;
    nombre: string;
    apellido: string;
}
