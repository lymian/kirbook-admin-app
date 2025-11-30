import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  usuarioNombre: string = '';

  constructor(private router: Router) { }

  ngOnInit() {
    const userString = localStorage.getItem('usuario');
    if (userString) {
      const user = JSON.parse(userString);
      this.usuarioNombre = `${user.nombre} ${user.apellido}`;
    }
  }

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
