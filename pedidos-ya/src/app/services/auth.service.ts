// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
    providedIn: 'root' // Esto hace que el servicio esté disponible en toda la aplicación.
})
export class AuthService {
    // URL base de tu API de NestJS. Ajústala si es diferente.
    // Es una buena práctica mover esto a los archivos de environment (environment.ts).
    private apiUrl = 'http://localhost:3001';

    private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    get isLoggedIn$(): Observable<boolean> {
        return this.loggedIn.asObservable();
    }

    // Creamos un método privado para verificar si hay un token al inicio
    private hasToken(): boolean {
        return !!localStorage.getItem('accessToken');
    }
    /**
     * Envía los datos del nuevo usuario al endpoint de registro del backend.
     * @param userData Objeto con los datos del usuario a registrar.
     */
    register(userData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/register`, userData);
    }

    /**
     * Envía las credenciales (email y password) al endpoint de login.
     * Si el login es exitoso, guarda el token de acceso.
     * @param credentials Objeto con email y password.
     */
    login(credentials: any): Observable<{ accessToken: string }> {
        return this.http.post<{ accessToken: string }>(`${this.apiUrl}/auth/login`, credentials).pipe(
            tap(response => {
                // 'tap' nos permite ejecutar una acción secundaria sin modificar la respuesta.
                // Si la respuesta tiene un accessToken, lo guardamos.
                if (response.accessToken) {
                    localStorage.setItem('accessToken', response.accessToken);
                    this.loggedIn.next(true);
                }
            })
        );
    }

    /**
     * Elimina el token de acceso del almacenamiento y redirige al login.
     */
    logout(): void {
        localStorage.removeItem('accessToken');
        this.loggedIn.next(false);
        this.router.navigate(['/login']);
    }

    /**
     * Obtiene el token de acceso guardado.
     * @returns El token como string, o null si no existe.
     */
    getToken(): string | null {
        return localStorage.getItem('accessToken');
    }

    /**
     * Verifica si el usuario está actualmente logueado (si existe un token).
     * @returns true si hay un token, false en caso contrario.
     */
    isLoggedIn(): boolean {
        // La doble negación (!!) convierte el valor en un booleano.
        // Si getToken() devuelve un string, !!'string' es true.
        // Si getToken() devuelve null, !!null es false.
        return !!this.getToken();
    }

    /**
   * Decodifica el token JWT guardado y devuelve el rol del usuario.
   * @returns El rol del usuario ('admin', 'moderator', 'user') o null si no hay token.
   */
    getUserRole(): string | null {
        const token = this.getToken(); // Usamos el método que ya tenías
        if (!token) {
            return null;
        }

        try {
            // 2. Decodificamos el token y extraemos el rol
            const decodedToken: any = jwtDecode(token);
            // Asumimos que en el backend, al crear el token, incluiste el 'role' en el payload.
            return decodedToken.role;
        } catch (error) {
            console.error("Error al decodificar el token", error);
            return null;
        }
    }

    getUserInfoFromToken(): { firstName: string, lastName: string, email: string, role: string } | null {
        const token = this.getToken();
        if (!token) return null;
        try {
            // Asumimos que el payload tiene estos campos. ¡Asegúrate de que tu backend los incluya al crear el token!
            return jwtDecode(token);
        } catch (error) {
            return null;
        }
    }
}