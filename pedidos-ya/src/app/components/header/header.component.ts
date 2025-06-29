// En: src/app/components/header/header.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent implements OnInit {

  isLoggedIn = false;
  userName = '';
  userRole = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Verificamos el estado del login cuando el componente se inicia
    this.isLoggedIn = this.authService.isLoggedIn();

    if (this.isLoggedIn) {
      // Si el usuario está logueado, obtenemos su información
      const userInfo = this.authService.getUserInfoFromToken();
      if (userInfo) {
        // Asumimos que el payload del token tiene nombre y rol
        this.userName = `${userInfo.firstName} ${userInfo.lastName}`;
        this.userRole = userInfo.role;
      }
    }
  }

  logout(): void {
    this.authService.logout();
    // Forzamos la recarga de la página para que el header se actualice, o navegamos al login.
    window.location.reload();
  }
}
