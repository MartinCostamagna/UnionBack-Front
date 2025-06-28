// src/app/services/country.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Country } from '../models/country.model';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private readonly apiUrl = 'http://localhost:3001';
  private readonly endpoint = '/countries';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene una lista de todos los países.
   */
  getCountries(): Observable<PaginatedResponse<Country>> {
    const fullUrl = `${this.apiUrl}${this.endpoint}`;
    return this.http.get<PaginatedResponse<Country>>(fullUrl);
  }

  /**
   * Obtiene un único país por su ID.
   * @param id El ID del país a buscar.
   */
  getCountryById(id: number): Observable<Country> {
    return this.http.get<Country>(`${this.apiUrl}${this.endpoint}/${id}`);
  }

  /**
   * Crea un nuevo país en la base de datos.
   * @param countryData Los datos del país a crear.
   */
  createCountry(countryData: Omit<Country, 'id' | 'provinces'>): Observable<Country> {
    return this.http.post<Country>(`${this.apiUrl}${this.endpoint}`, countryData);
  }

  /**
   * Actualiza un país existente.
   * @param id El ID del país a actualizar.
   * @param countryData Los campos del país a actualizar.
   */
  updateCountry(id: number, countryData: Partial<Omit<Country, 'id' | 'provinces'>>): Observable<Country> {
    return this.http.put<Country>(`${this.apiUrl}${this.endpoint}/${id}`, countryData);
  }

  /**
   * Elimina un país de la base de datos.
   * @param id El ID del país a eliminar.
   */
  deleteCountry(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${this.endpoint}/${id}`);
  }
}