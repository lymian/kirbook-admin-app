import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LibroService } from '../../services/libro-service';
import { PedidoService } from '../../services/pedido-service';
import { ClienteService } from '../../services/cliente-service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit {
  totalPedidosPendientes: number = 0;
  totalLibros: number = 0;
  totalClientes: number = 0;
  alertasStock: number = 0;

  librosBajoStock: any[] = [];
  ultimosPedidos: any[] = [];

  cargando: boolean = true;

  constructor(
    private libroService: LibroService,
    private pedidoService: PedidoService,
    private clienteService: ClienteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;

    forkJoin({
      libros: this.libroService.obtenerLibros(),
      clientes: this.clienteService.obtenerClientes(),
      pedidos: this.pedidoService.obtenerPedidosPorEstadoPaginado('pendiente', 0, 5)
    }).subscribe({
      next: (res: any) => {
        // Libros
        this.totalLibros = res.libros.length;
        this.librosBajoStock = res.libros.filter((l: any) => l.stock < 5);
        this.alertasStock = this.librosBajoStock.length;

        // Clientes
        this.totalClientes = res.clientes.length;

        // Pedidos
        this.totalPedidosPendientes = res.pedidos.totalElements;
        this.ultimosPedidos = res.pedidos.content;

        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar datos del dashboard', err);
        this.cargando = false;
      }
    });
  }

  irAPedidos() {
    this.router.navigate(['/dashboard/pedidos']);
  }
}
