import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule, // Necesario para directivas como *ngIf
    ReactiveFormsModule // Necesario para [formGroup] y formControlName
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit { // <-- Implementamos OnInit para usar su ciclo de vida

  // Declaramos la propiedad para nuestro formulario
  loginForm!: FormGroup;

  // Inyectamos las dependencias que vamos a usar
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  // ngOnInit se ejecuta una vez cuando el componente se inicia
  ngOnInit(): void {
    // Creamos la estructura del formulario con sus campos y reglas de validación
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  // Este método se llamará cuando el usuario envíe el formulario
  onSubmit(): void {
    // Si el formulario no es válido, detenemos la ejecución
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // Marca los campos para mostrar los errores
      return;
    }

    // Llamamos al método 'login' de nuestro servicio con los datos del formulario
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        this.router.navigate(['/home']); // Puedes cambiar '/home' por tu ruta deseada
      },
      error: (err) => {
        console.error('Error durante el login:', err);
        // Mostramos el mensaje de error que viene del backend
        alert(`Error: ${err.error?.message || 'Credenciales inválidas o error en el servidor.'}`);
      }
    });
  }
}
