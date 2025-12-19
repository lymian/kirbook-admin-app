import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibroService } from '../../services/libro-service';

import { LibroResponseDTO } from '../../models/libro.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-libros',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './libros.html',
  styleUrls: ['./libros.css'],
})
export class Libros implements OnInit {

  libros: LibroResponseDTO[] = [];
  cargando = false;

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
  libroEstadoSeleccionado: LibroResponseDTO | null = null;

  constructor(private libroService: LibroService) { }

  ngOnInit(): void {
    this.obtenerLibros();
  }

  /** ----------- MODALES ----------- */
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

  /** ----------- LISTADO ----------- */
  /** ----------- LISTADO ----------- */
  obtenerLibros() {
    this.cargando = true;
    this.libroService.obtenerLibrosPaginados(this.page, this.size).subscribe({
      next: (data) => {
        this.libros = data.content;
        this.totalPages = data.totalPages;
        this.totalElements = data.totalElements;
        this.first = data.first;
        this.last = data.last;
        this.cargando = false;
        this.calcularPaginas();
      },
      error: () => {
        this.mostrarError('No se pudieron cargar los libros.');
        this.cargando = false;
      },
    });
  }

  cambiarPagina(newPage: number) {
    this.page = newPage;
    this.obtenerLibros();
  }

  calcularPaginas() {
    this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i);
  }

  /** ----------- CAMBIAR ESTADO ----------- */
  confirmarEstado(libro: LibroResponseDTO) {
    this.libroEstadoSeleccionado = libro;
    this.modalConfirmar = true;
  }

  cancelarConfirmar() {
    this.modalConfirmar = false;
    this.libroEstadoSeleccionado = null;
  }

  cambiarEstadoConfirmado() {
    if (!this.libroEstadoSeleccionado) return;

    const nuevoEstado = !this.libroEstadoSeleccionado.estado;

    const dto = {
      titulo: this.libroEstadoSeleccionado.titulo,
      sinopsis: this.libroEstadoSeleccionado.sinopsis,
      fechaPublicacion: this.libroEstadoSeleccionado.fechaPublicacion,
      precio: this.libroEstadoSeleccionado.precio,
      descuento: this.libroEstadoSeleccionado.descuento,
      stock: this.libroEstadoSeleccionado.stock,
      estado: nuevoEstado,
      autorId: this.libroEstadoSeleccionado.autorId,
      categoriaId: this.libroEstadoSeleccionado.categoriaId,
    };

    this.libroService.actualizarLibro(this.libroEstadoSeleccionado.id, dto).subscribe({
      next: () => {
        this.obtenerLibros();
        this.mostrarExito('Estado actualizado correctamente.');
      },
      error: (err) =>
        this.mostrarError(
          err?.error?.error ??
          err?.error?.message ??
          'Error al actualizar estado.'
        ),
    });

    this.cancelarConfirmar();
  }

  /** ----------- EXPORTAR EXCEL ----------- */
  exportarExcel() {
    this.cargando = true;
    this.libroService.obtenerLibros().subscribe({
      next: (data) => {
        // Prepara los datos para las filas
        const rows = data.map((libro: any) => [
          libro.id,
          libro.titulo,
          libro.autorNombre,
          libro.categoriaNombre,
          libro.precio,
          (libro.descuento || 0) + '%',
          libro.stock,
          libro.estado ? 'Activo' : 'Inactivo',
          libro.fechaPublicacion
        ]);

        import('exceljs').then((module) => {
          const ExcelJS: any = module.default || module;
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet('Libros');

          // Definir estructura de la tabla con diseño
          worksheet.addTable({
            name: 'TablaLibros',
            ref: 'A1',
            headerRow: true,
            totalsRow: false,
            style: {
              theme: 'TableStyleMedium2', // Estilo azul por defecto de Excel muy limpio
              showRowStripes: true,
            },
            columns: [
              { name: 'ID', filterButton: true },
              { name: 'Título', filterButton: true },
              { name: 'Autor', filterButton: true },
              { name: 'Categoría', filterButton: true },
              { name: 'Precio', filterButton: true },
              { name: 'Descuento', filterButton: true },
              { name: 'Stock', filterButton: true },
              { name: 'Estado', filterButton: true },
              { name: 'Fecha Publicación', filterButton: true },
            ],
            rows: rows,
          });

          // Ajustar ancho de columnas para mejor visualización
          worksheet.columns.forEach((column) => {
            column.width = 20;
          });
          worksheet.getColumn(1).width = 10; // ID más pequeño
          worksheet.getColumn(2).width = 40; // Título más ancho

          // Generar archivo
          workbook.xlsx.writeBuffer().then((buffer) => {
            this.guardarArchivo(buffer, 'libros_export');
            this.cargando = false;
          });
        });
      },
      error: () => {
        this.mostrarError('No se pudieron obtener los datos para exportar.');
        this.cargando = false;
      }
    });
  }

  guardarArchivo(buffer: any, fileName: string) {
    import('file-saver').then((FileSaver) => {
      const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
      FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + EXCEL_EXTENSION);
    });
  }

}
