import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  username: string = '';
  password: string = '';
  errorMensaje: string = '';
  cargando: boolean = false;

  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  iniciarSesion() {
    this.errorMensaje = '';
    this.cargando = true;

    this.loginService.login(this.username, this.password).subscribe({
      next: (respuesta) => {

        // Guardar token
        localStorage.setItem('token', respuesta.token);

        // Guardar usuario
        localStorage.setItem('usuario', JSON.stringify(respuesta.usuario));

        // Verificar rol
        if (respuesta.usuario.rol === 'ROLE_ADMIN') {
          this.router.navigate(['/dashboard/inicio']);
        } else {
          this.errorMensaje = 'No tienes permisos para acceder al panel de administración.';
        }

        this.cargando = false;
      },
      error: (err) => {
        this.errorMensaje = err.message;
        this.cargando = false;
      },
    });
  }
}
