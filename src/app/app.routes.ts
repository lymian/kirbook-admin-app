import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { Inicio } from './dashboard/inicio/inicio';
import { Autores } from './dashboard/autores/autores';
import { Libros } from './dashboard/libros/libros';
import { Pedidos } from './dashboard/pedidos/pedidos';
import { Clientes } from './dashboard/clientes/clientes';
import { RegistrarLibroComponent } from './dashboard/libro-registrar/libro-registrar';
import { EditarLibroComponent } from './dashboard/editar-libro.component/editar-libro.component';

export const routes: Routes = [
    {
        path: '',
        component: Login
    },
    {
        path: 'dashboard',
        component: Dashboard, children: [
            { path: 'inicio', component: Inicio },
            { path: 'autores', component: Autores },
            { path: 'libros', component: Libros },
            { path: 'pedidos', component: Pedidos },
            { path: 'clientes', component: Clientes },
            { path: 'libros/registrar', component: RegistrarLibroComponent },
            { path: 'libros/editar/:id', component: EditarLibroComponent },
        ]
    },
    { path: '**', redirectTo: '' },
];
