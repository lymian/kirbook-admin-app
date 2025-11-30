import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../services/cliente-service';
import { ClienteResponseDTO } from '../../models/cliente.model';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clientes.html',
})
export class Clientes implements OnInit {
  clientes: ClienteResponseDTO[] = [];
  cargando: boolean = false;
  modalExito: string = '';
  modalError: string = '';

  constructor(private clienteService: ClienteService) { }

  ngOnInit(): void {
    this.obtenerClientes();
  }

  obtenerClientes() {
    this.cargando = true;
    this.clienteService.obtenerClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener clientes', err);
        this.mostrarError('No se pudieron cargar los clientes.');
        this.cargando = false;
      },
    });
  }

  alternarEstado(clienteDTO: ClienteResponseDTO) {
    const nuevoEstado = !clienteDTO.cliente.estado;
    this.clienteService.alternarEstadoCliente(clienteDTO.cliente.id, nuevoEstado).subscribe({
      next: () => {
        clienteDTO.cliente.estado = nuevoEstado;
        this.mostrarExito(`Cliente ${nuevoEstado ? 'habilitado' : 'deshabilitado'} correctamente.`);
      },
      error: (err) => {
        console.error('Error al cambiar estado', err);
        this.mostrarError('No se pudo cambiar el estado del cliente.');
      }
    });
  }

  mostrarExito(mensaje: string) {
    this.modalExito = mensaje;
  }

  mostrarError(mensaje: string) {
    this.modalError = mensaje;
  }
}
