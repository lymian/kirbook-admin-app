import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AutorService } from '../../services/autor-service';
import { AutorRequestDTO, AutorResponseDTO } from '../../models/autor.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-autores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './autores.html',
  styleUrls: ['./autores.css'],
})
export class Autores implements OnInit {

  autores: AutorResponseDTO[] = [];
  autorNuevo: AutorRequestDTO = { nombre: '', apellido: '' };
  autorEditando: AutorResponseDTO | null = null;

  cargando = false;

  // Estado de modales
  modalExito = '';
  modalError = '';
  confirmandoEliminar = false;
  idAEliminar: number | null = null;

  constructor(private autorService: AutorService) { }

  ngOnInit(): void {
    this.obtenerAutores();
  }

  /** ------ UTILIDADES DE MODALES ------ */
  mostrarExito(msg: string) {
    this.modalExito = msg;
    setTimeout(() => (this.modalExito = ''), 2500);
  }

  mostrarError(msg: string) {
    this.modalError = msg;
  }

  cerrarError() {
    this.modalError = '';
  }

  /** ------ CRUD ------ */
  obtenerAutores() {
    this.cargando = true;
    this.autorService.obtenerAutores().subscribe({
      next: (data) => {
        this.autores = data;
        this.cargando = false;
      },
      error: () => {
        this.mostrarError('No se pudieron cargar los autores.');
        this.cargando = false;
      },
    });
  }

  crearAutor() {
    if (!this.autorNuevo.nombre.trim() || !this.autorNuevo.apellido.trim()) {
      return this.mostrarError('Debes completar todos los campos.');
    }

    this.autorService.crearAutor(this.autorNuevo).subscribe({
      next: () => {
        this.autorNuevo = { nombre: '', apellido: '' };
        this.obtenerAutores();
        this.mostrarExito('Autor creado correctamente.');
      },
      error: () => this.mostrarError('Error al crear autor.'),
    });
  }

  seleccionarAutor(autor: AutorResponseDTO) {
    this.autorEditando = { ...autor };
  }

  actualizarAutor() {
    if (!this.autorEditando) return;

    this.autorService.actualizarAutor(
      this.autorEditando.id,
      {
        nombre: this.autorEditando.nombre,
        apellido: this.autorEditando.apellido,
      }
    ).subscribe({
      next: () => {
        this.autorEditando = null;
        this.obtenerAutores();
        this.mostrarExito('Autor actualizado correctamente.');
      },
      error: () => this.mostrarError('Error al actualizar autor.'),
    });
  }

  /** ------ ELIMINACIÓN ------ */
  confirmarEliminar(id: number) {
    this.idAEliminar = id;
    this.confirmandoEliminar = true;
  }

  cancelarEliminar() {
    this.idAEliminar = null;
    this.confirmandoEliminar = false;
  }

  eliminarAutorConfirmado() {
    if (!this.idAEliminar) return;

    this.autorService.eliminarAutor(this.idAEliminar).subscribe({
      next: () => {
        this.obtenerAutores();
        this.mostrarExito('Autor eliminado correctamente.');
      },
      error: (err: HttpErrorResponse) => {
        const msg =
          err?.error?.error ??
          err?.error?.message ??
          (typeof err?.error === 'string' ? err.error : 'Error al eliminar autor.');

        this.mostrarError(msg);
      },
    });

    this.cancelarEliminar();
  }
}
