import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LibroService } from '../../services/libro-service';
import { AutorService } from '../../services/autor-service';
import { CategoriaService } from '../../services/categoria-service';

import { LibroRequestDTO } from '../../models/libro.model';
import { Autor } from '../../models/autor.model';
import { Categoria } from '../../models/categoria.model';

import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar-libro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './libro-registrar.html',
  styleUrls: ['./libro-registrar.css'],
})
export class RegistrarLibroComponent implements OnInit {

  autores: Autor[] = [];
  categorias: Categoria[] = [];

  libro: LibroRequestDTO = {
    titulo: '',
    sinopsis: '',
    fechaPublicacion: '',
    precio: 0,
    descuento: 0,
    stock: 0,
    estado: true,
    autorId: 0,
    categoriaId: 0,
  };

  modalExito = '';
  modalError = '';

  constructor(
    private libroService: LibroService,
    private autorService: AutorService,
    private categoriaService: CategoriaService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.cargarAutores();
    this.cargarCategorias();
  }

  cargarAutores() {
    this.autorService.obtenerAutores().subscribe({
      next: (data) => (this.autores = data),
      error: () => this.mostrarError('Error al cargar autores.'),
    });
  }

  cargarCategorias() {
    this.categoriaService.obtenerCategorias().subscribe({
      next: (data) => (this.categorias = data),
      error: () => this.mostrarError('Error al cargar categorías.'),
    });
  }

  registrarLibro() {
    if (!this.validar()) {
      return this.mostrarError('Debes completar todos los campos correctamente.');
    }

    this.libroService.crearLibro(this.libro).subscribe({
      next: () => {
        this.mostrarExito('Libro registrado correctamente.');
        this.limpiar();
      },
      error: (err: HttpErrorResponse) => {
        this.mostrarError(
          err?.error?.error ??
          err?.error?.message ??
          'Error al registrar libro.'
        );
      }
    });
  }

  validar(): boolean {
    const l = this.libro;
    return (
      l.titulo.trim().length > 0 &&
      l.sinopsis.trim().length > 0 &&
      l.fechaPublicacion.trim().length > 0 &&
      l.precio >= 0 &&
      l.descuento >= 0 && l.descuento <= 50 && // Validar descuento (0-50)
      l.stock >= 0 &&
      l.autorId > 0 &&
      l.categoriaId > 0
    );
  }

  limpiar() {
    this.libro = {
      titulo: '',
      sinopsis: '',
      fechaPublicacion: '',
      precio: 0,
      descuento: 0,
      stock: 0,
      estado: true,
      autorId: 0,
      categoriaId: 0,
    };
  }

  mostrarExito(msg: string) {
    this.modalExito = msg;
    setTimeout(() => (this.modalExito = ''), 3000);
  }

  mostrarError(msg: string) {
    this.modalError = msg;
  }

  cerrarError() {
    this.modalError = '';
  }
  volver() {
    this.router.navigate(['/dashboard/libros']);
  }

}
