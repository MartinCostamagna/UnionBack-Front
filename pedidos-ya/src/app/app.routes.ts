import { Routes } from '@angular/router';
import { TemplateComponent } from './pages/template/template.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { Registro } from './pages/registro/registro';
import { TablaDeDatos } from './pages/tabla-de-datos/tabla-de-datos';
import { CrearPersona } from './pages/crear-persona/crear-persona';
import { EditarPersona } from './pages/editar-persona/editar-persona';

export const routes: Routes = [
  {
    path: '',
    component: TemplateComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: Registro },
  { path: 'TablaDeDatos', component: TablaDeDatos },
  { path: 'CrearPersona', component: CrearPersona },
  { path: 'EditarPersona', component: EditarPersona }
];
