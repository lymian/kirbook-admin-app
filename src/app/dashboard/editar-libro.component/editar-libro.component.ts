import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LibroService } from '../../services/libro-service';
import { CategoriaService } from '../../services/categoria-service';
import { AutorService } from '../../services/autor-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-libro',
  templateUrl: './editar-libro.component.html',
  styleUrls: ['./editar-libro.component.css'],
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
})
export class EditarLibroComponent implements OnInit {

  libroForm!: FormGroup;
  libroId!: number;

  autores: any[] = [];
  categorias: any[] = [];

  cargando = true;
  error = '';
  exito = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private libroService: LibroService,
    private categoriaService: CategoriaService,
    private autorService: AutorService    // ← AGREGADO
  ) { }

  ngOnInit(): void {
    this.libroId = Number(this.route.snapshot.paramMap.get('id'));

    this.libroForm = this.fb.group({
      titulo: ['', Validators.required],
      sinopsis: ['', Validators.required],
      fechaPublicacion: ['', Validators.required], // ← agregado
      precio: ['', [Validators.required, Validators.min(1)]],
      descuento: ['', [Validators.min(0), Validators.max(50)]], // ← agregado
      stock: ['', [Validators.required, Validators.min(0)]],
      autorId: ['', Validators.required],
      categoriaId: ['', Validators.required],
      estado: [true]
    });


    this.cargarListas();
    this.cargarLibro();
  }

  cargarListas() {
    this.categoriaService.obtenerCategorias()
      .subscribe(res => this.categorias = res);

    this.autorService.obtenerAutores()              // ← AGREGADO
      .subscribe(res => this.autores = res);
  }

  cargarLibro() {
    this.libroService.obtenerLibroPorId(this.libroId).subscribe({
      next: (data) => {
        this.libroForm.patchValue(data);
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo cargar la información del libro.';
        this.cargando = false;
      }
    });
  }

  guardarCambios() {
    if (this.libroForm.invalid) return;

    const formData = {
      ...this.libroForm.value,
      fechaPublicacion: this.libroForm.value.fechaPublicacion // mantiene string sin convertir
    };

    this.libroService.actualizarLibro(this.libroId, formData).subscribe({
      next: () => {
        this.exito = 'Libro actualizado correctamente';
        setTimeout(() => this.ngOnInit(), 1200);
      },
      error: () => {
        this.error = 'Error al actualizar el libro.';
      }
    });
  }


  volver() {
    this.router.navigate(['/dashboard/libros']);
  }
}
