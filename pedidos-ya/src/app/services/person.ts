import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Person } from '../models/person.model';
import { PaginatedResponse } from '../models/pagination.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PersonsService {

  private readonly apiUrl = 'http://localhost:3001';
  private readonly endpoint = '/persons';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders | null {
    // Le pedimos el token directamente al AuthService
    const token = this.authService.getToken();

    if (!token) {
      return null;
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getPersons(page: number, limit: number): Observable<PaginatedResponse<Person>> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError(() => new Error('No se encontró el token de autenticación.'));
    }

    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<PaginatedResponse<Person>>(`${this.apiUrl}${this.endpoint}`, { headers, params })
      .pipe(
        catchError(err => {
          console.error('Ocurrió un error en getPersons:', err);
          return throwError(() => new Error('Error al obtener los datos de las personas.'));
        })
      );
  }

  deletePerson(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError(() => new Error('No se encontró el token de autenticación.'));
    }
    return this.http.delete<void>(`${this.apiUrl}${this.endpoint}/${id}`, { headers });
  }
}